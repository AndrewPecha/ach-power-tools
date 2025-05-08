package infrastructure

import "ach-power-tools"

type NocRepositoryLocal struct {
	noc_records []ach_power_tools.NocRecord
}

func NewNocRepositoryLocal() NocRepositoryLocal {
	return NocRepositoryLocal{
		noc_records: []ach_power_tools.NocRecord{},
	}
}

func (repo *NocRepositoryLocal) StoreNocRecord(record ach_power_tools.NocRecord) error {
	if repo.noc_records == nil {
		repo.noc_records = []ach_power_tools.NocRecord{}
	}

	repo.noc_records = append(repo.noc_records, record)
	return nil
}

func (repo NocRepositoryLocal) GetNocRecords() []ach_power_tools.NocRecord {
	return repo.noc_records
}
