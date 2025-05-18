package main

import (
	ach_power_tools "ach-power-tools"
	"ach-power-tools/achpt"
	"ach-power-tools/infrastructure"
	"encoding/json"
	"fmt"
	"github.com/moov-io/ach"
	"io"
	"net/http"
	"strings"
)

var repo = infrastructure.NewNocRepositoryLocal()

func achHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, achpt.CreateSampleAch())
}

func achAsJsonHandler(w http.ResponseWriter, r *http.Request) {
	reader := ach.NewReader(strings.NewReader(achpt.CreateSampleAch()))
	achFile, err := reader.Read()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonData, err := achFile.MarshalJSON()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(jsonData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func achSampleFileDownloadHandler(w http.ResponseWriter, r *http.Request) {
	achText := achpt.CreateSampleAch()
	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Content-Disposition", `attachment; filename="ach-file-sample.ach"`)
	w.WriteHeader(http.StatusOK)
	_, err := w.Write([]byte(achText))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func achStringToJsonHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Read the file content from the request body
	defer r.Body.Close()
	err, achFile := parseAchFileFromRequest(w, r)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to convert ACH to JSON: %v", err), http.StatusInternalServerError)
		return
	}

	// Convert the ACH file content to JSON
	jsonData, err := achFile.MarshalJSON()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to convert ACH to JSON: %v", err), http.StatusInternalServerError)
		return
	}

	// Set the response headers and write the JSON output
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(jsonData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func parseAchFileFromRequest(w http.ResponseWriter, r *http.Request) (error, ach.File) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return err, ach.File{}
	}

	// Parse the ACH file content
	reader := ach.NewReader(strings.NewReader(string(body)))
	achFile, err := reader.Read()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to parse ACH file: %v", err), http.StatusBadRequest)
		return err, ach.File{}
	}
	return err, achFile
}

func storeNocEntries(w http.ResponseWriter, r *http.Request) {

	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Read the file content from the request body
	defer r.Body.Close()
	err, achFile := parseAchFileFromRequest(w, r)

	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to parse ACH file: %v", err), http.StatusBadRequest)
		return
	}

	// Extract NOC (Notification of Change) entries from the ACH file
	for _, batch := range achFile.Batches {
		for _, entry := range batch.GetEntries() {
			if entry.Addenda98 != nil { // Addenda98 contains details on NOC entries
				var incorrectValue string = "missing"
				if entry.Addenda98.ChangeCode == "C01" {
					incorrectValue = entry.DFIAccountNumber
				}

				repo.StoreNocRecord(ach_power_tools.NocRecord{
					IncorrectValue: incorrectValue,
					CorrectedValue: entry.Addenda98.CorrectedData,
					CCode:          entry.Addenda98.ChangeCode,
				})
			}
		}
	}

	// Respond with success if NOC entries are stored, or no NOC entries found
	if len(repo.GetNocRecords()) > 0 {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "NOC records stored successfully: %d entries", len(repo.GetNocRecords()))
	} else {
		w.WriteHeader(http.StatusNoContent)
		fmt.Fprint(w, "No NOC records found in the ACH file")
	}
}

func retrieveNocEntries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Retrieve all NOC entries stored in the repository and return them as a JSON array
	records := repo.GetNocRecords()

	// Convert the NOC records into JSON format
	jsonData, err := json.Marshal(records)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to convert NOC records to JSON: %v", err), http.StatusInternalServerError)
		return
	}

	// Set the response headers and write the JSON output
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(jsonData)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to write JSON response: %v", err), http.StatusInternalServerError)
	}
}

func correctFileFromNocStore(w http.ResponseWriter, r *http.Request) {
	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Read the file content from the request body
	defer r.Body.Close()
	err, achFile := parseAchFileFromRequest(w, r)

	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to parse ACH file: %v", err), http.StatusBadRequest)
		return
	}

	correctedFile := correctEntriesFromNocStore(achFile)

	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Content-Disposition", `attachment; filename="corrected-ach-file.ach"`)
	w.WriteHeader(http.StatusOK)

	_, err = w.Write([]byte(achpt.GetAchFileString(&correctedFile)))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func correctEntriesFromNocStore(achFile ach.File) ach.File {
	for _, batch := range achFile.Batches {
		for _, entry := range batch.GetEntries() {
			nocRecords := repo.GetNocRecords()
			for _, record := range nocRecords {
				if record.IncorrectValue == entry.DFIAccountNumber {
					entry.DFIAccountNumber = record.CorrectedValue
				}
			}
		}

		err := achFile.Validate()
		if err != nil {
			return ach.File{}
		}

	}

	return achFile
}

func main() {
	http.HandleFunc("/sample-ach", achHandler)
	http.HandleFunc("/sample-ach-json", achAsJsonHandler)
	http.HandleFunc("/download-sample-ach", achSampleFileDownloadHandler)
	http.HandleFunc("/ach-to-json", achStringToJsonHandler)
	http.HandleFunc("/store-noc-entries", storeNocEntries)
	http.HandleFunc("/get-noc-entries", retrieveNocEntries)
	http.HandleFunc("/correct-file-from-noc-store", correctFileFromNocStore)
	fmt.Println("Server started on port 8080")
	http.ListenAndServe(":8080", nil)
}
