package ach_power_tools

type NocRecord struct {
	IncorrectValue string
	CorrectedValue string
	CCode          string
}

type NocRepository interface {
	StoreNocRecord(record NocRecord) error
	GetNocRecords() []NocRecord
}
