package achpt

import (
	"github.com/moov-io/ach"
	"log"
	"strings"
	"time"
)

func CreateSampleAch() string {
	t := time.Now()

	fh := ach.NewFileHeader()
	fh.ImmediateDestination = "031300012"
	fh.ImmediateOrigin = "231380104"
	fh.FileCreationDate = t.Format("060102")
	fh.FileCreationTime = t.Format("1504")
	fh.ImmediateDestinationName = "Federal Reserve Bank"
	fh.ImmediateOriginName = "My Bank Name"
	fh.ReferenceCode = "12345678"

	bh := ach.NewBatchHeader()
	bh.ServiceClassCode = ach.DebitsOnly
	bh.CompanyName = "Name on Account"
	bh.CompanyIdentification = fh.ImmediateOrigin
	bh.StandardEntryClassCode = ach.CCD
	bh.CompanyEntryDescription = "Vndr Pay"
	bh.EffectiveEntryDate = "190816"
	bh.ODFIIdentification = "031300012"

	entry := ach.NewEntryDetail()
	entry.TransactionCode = ach.CheckingDebit
	entry.SetRDFI("231380104")
	entry.DFIAccountNumber = "744-5678-99"
	entry.Amount = 500000
	entry.IdentificationNumber = "location #1234"
	entry.SetReceivingCompany("Best Co. #1")
	entry.SetTraceNumber(bh.ODFIIdentification, 1)
	entry.DiscretionaryData = "S"

	entryOne := ach.NewEntryDetail()
	entryOne.TransactionCode = ach.CheckingDebit
	entryOne.SetRDFI("231380104")
	entryOne.DFIAccountNumber = "744-5678-99"
	entryOne.Amount = 125
	entryOne.IdentificationNumber = "Fee #1"
	entryOne.SetReceivingCompany("Best Co. #1")
	entryOne.SetTraceNumber(bh.ODFIIdentification, 2)
	entryOne.DiscretionaryData = "S"

	bh_two := ach.NewBatchHeader()
	bh_two.ServiceClassCode = ach.DebitsOnly
	bh_two.CompanyName = "Name on Account"
	bh_two.CompanyIdentification = fh.ImmediateOrigin
	bh_two.StandardEntryClassCode = ach.PPD
	bh_two.CompanyEntryDescription = "Vndr Pay"
	bh_two.EffectiveEntryDate = "190816"
	bh_two.ODFIIdentification = "031300012"

	batch := ach.NewBatchCCD(bh)
	batch.AddEntry(entry)
	batch.AddEntry(entryOne)
	if err := batch.Create(); err != nil {
		log.Fatalf("Unexpected error building batch: %s\n", err)
	}

	batch_two := ach.NewBatchPPD(bh_two)
	batch_two.AddEntry(entry)
	batch_two.AddEntry(entryOne)
	if err := batch_two.Create(); err != nil {
		log.Fatalf("Unexpected error building batch: %s\n", err)
	}

	file := ach.NewFile()
	file.SetHeader(fh)
	file.AddBatch(batch)
	file.AddBatch(batch_two)
	if err := file.Create(); err != nil {
		log.Fatalf("Unexpected error building file: %s\n", err)
	}

	var sb = new(strings.Builder)
	var writer = ach.NewWriter(sb)

	if err := writer.Write(file); err != nil {
		log.Fatalf("Unexpected error writing file: %s\n", err)
	}

	return sb.String()
}
