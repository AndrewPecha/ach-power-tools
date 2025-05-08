package infrastructure

import (
	"ach-power-tools"
	"testing"
)

func TestNocRepositoryLocal_StoreNocRecord(t *testing.T) {
	noc_record := ach_power_tools.NocRecord{
		IncorrectValue: "1",
		CorrectedValue: "2",
		CCode:          "01",
	}

	repo := NewNocRepositoryLocal()
	if repo.StoreNocRecord(noc_record) != nil {
		t.Error("Error storing NOC record")
	}

	if len(repo.GetNocRecords()) != 1 {
		t.Error("NOC record not stored")
	}

	if repo.GetNocRecords()[0].IncorrectValue != "1" {
		t.Error("Incorrect value not stored")
	}

	if repo.GetNocRecords()[0].CorrectedValue != "2" {
		t.Error("Corrected value not stored")
	}

	if repo.GetNocRecords()[0].CCode != "01" {
		t.Error("CCode not stored")
	}
}
