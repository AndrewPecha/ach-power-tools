import Collapsible from "../components/Collapsible.tsx";
import {useEffect, useState} from "react";
import type {AchFile} from "../types/achFile.ts";

function AchBuilder() {
    const [achFile, setAchFile] = useState<AchFile>();

    const fetchAch = async () => {
        console.log('Fetching data...');
        const response = await fetch('http://localhost:8080/sample-ach-json');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const data_with_batches_removed = {...data, batches: []}
        setAchFile(data_with_batches_removed);
    };

    useEffect(() => {
        fetchAch().catch(error => console.error(error));
    }, [])

    const addBatchToFile = () => {
        if (!achFile) {
            return;
        }

        return {
            ...achFile,
            batches: [
                ...achFile.batches,
                {
                    batchHeader: {
                        serviceClassCode: 200,
                        companyName: "New Company",
                        companyDiscretionaryData: "",
                        companyIdentification: "",
                        standardEntryClassCode: "PPD",
                        companyEntryDescription: "",
                        companyDescriptiveDate: "",
                        effectiveEntryDate: "",
                        settlementDate: "",
                        originatorStatusCode: 1,
                        ODFIIdentification: "",
                        batchNumber: achFile.batches.length + 1
                    },
                    entryDetails: [],
                    batchControl: {
                        serviceClassCode: 200,
                        entryAddendaCount: 0,
                        entryHash: 0,
                        totalDebit: 0,
                        totalCredit: 0,
                        companyIdentification: "",
                        ODFIIdentification: "",
                        batchNumber: achFile.batches.length + 1
                    }
                }
            ]
        }
    }

    return (
        <>
            <h1>ACH Builder!</h1>
            {achFile && (
                <Collapsible title="File Header">
                    <p>Immediate Destination: {achFile.fileHeader.immediateDestination}</p>
                    <p>Immediate Origin: {achFile.fileHeader.immediateOrigin}</p>
                    <p>File Creation Date: {achFile.fileHeader.fileCreationDate}</p>
                    <p>File Creation Time: {achFile.fileHeader.fileCreationTime}</p>
                    <p>File ID: {achFile.fileHeader.fileIDModifier}</p>
                    <p>Immediate Destination Name: {achFile.fileHeader.immediateDestinationName}</p>
                    <p>Immediate Origin Name: {achFile.fileHeader.immediateOriginName}</p>
                    <p>Reference Code: {achFile.fileHeader.referenceCode}</p>
                </Collapsible>
            )}
            <Collapsible title="Batches">
                <div>
                    <button className="add-button"
                        onClick={() => {
                            if (achFile) {
                                setAchFile(addBatchToFile());
                            }
                        }}
                    >
                        Add Batch
                    </button>
                    {achFile?.batches.map((batch, index) => (
                        <Collapsible key={index} title={`Batch ${batch.batchHeader.batchNumber}`}>
                            <Collapsible title="Batch Header">
                                <p>Service Class Code: {batch.batchHeader.serviceClassCode}</p>
                                <p>Company Name: {batch.batchHeader.companyName}</p>
                                <p>SEC Code: {batch.batchHeader.standardEntryClassCode}</p>
                                <p>Company Discretionary Data: {batch.batchHeader.companyDiscretionaryData}</p>
                                <p>Company Identification: {batch.batchHeader.companyIdentification}</p>
                                <p>Company Entry Description: {batch.batchHeader.companyEntryDescription}</p>
                                <p>Company Descriptive Date: {batch.batchHeader.companyDescriptiveDate}</p>
                                <p>Effective Entry Date: {batch.batchHeader.effectiveEntryDate}</p>
                                <p>Settlement Date: {batch.batchHeader.settlementDate}</p>
                                <p>Originator Status Code: {batch.batchHeader.originatorStatusCode}</p>
                                <p>ODFI Identification: {batch.batchHeader.ODFIIdentification}</p>
                                <p>Batch Number: {batch.batchHeader.batchNumber}</p>
                            </Collapsible>
                            <Collapsible title="Entry Details">
                                <button className="add-button"
                                    onClick={() => {
                                        if (achFile) {
                                            const updatedBatches = [...achFile.batches];
                                            updatedBatches[index].entryDetails.push({
                                                transactionCode: 22,
                                                RDFIIdentification: "",
                                                checkDigit: "0",
                                                DFIAccountNumber: "",
                                                amount: 0,
                                                identificationNumber: "",
                                                individualName: "New Entry",
                                                discretionaryData: "",
                                                addendaRecordIndicator: 0,
                                                traceNumber: String(Date.now())
                                            });
                                            setAchFile({...achFile, batches: updatedBatches});
                                        }
                                    }}
                                >
                                    Add Entry
                                </button>
                                {batch.entryDetails.map((entry, entryIndex) => (
                                    <Collapsible key={entryIndex} title={`Entry ${entryIndex + 1}`}>
                                        <p>Transaction Code: {entry.transactionCode}</p>
                                        <p>Receiving DFI: {entry.RDFIIdentification}</p>
                                        <p>Check Digit: {entry.checkDigit}</p>
                                        <p>DFI Account: {entry.DFIAccountNumber}</p>
                                        <p>Amount: {entry.amount}</p>
                                        <p>Identification Number: {entry.identificationNumber}</p>
                                        <p>Individual Name: {entry.individualName}</p>
                                        <p>Discretionary Data: {entry.discretionaryData}</p>
                                        <p>Addenda Indicator: {entry.addendaRecordIndicator}</p>
                                        <p>Trace Number: {entry.traceNumber}</p>
                                    </Collapsible>
                                ))}
                            </Collapsible>
                            {batch.batchControl && (
                                <Collapsible title="Batch Control">
                                    <p>Service Class Code: {batch.batchControl.serviceClassCode}</p>
                                    <p>Entry/Addenda Count: {batch.batchControl.entryAddendaCount}</p>
                                    <p>Entry Hash: {batch.batchControl.entryHash}</p>
                                    <p>Total Debit: {batch.batchControl.totalDebit}</p>
                                    <p>Total Credit: {batch.batchControl.totalCredit}</p>
                                    <p>Company Identification: {batch.batchControl.companyIdentification}</p>
                                    <p>ODFI Identification: {batch.batchControl.ODFIIdentification}</p>
                                    <p>Batch Number: {batch.batchControl.batchNumber}</p>
                                </Collapsible>
                            )}

                        </Collapsible>
                    ))}
                </div>
            </Collapsible>
            <Collapsible title="File Control">
                <p>File Control goes here!</p>
            </Collapsible>

            <style>
                {`
                    .add-button {
                        padding: 8px 16px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        borderRadius: 4px;
                        cursor: pointer;
                        margin-bottom: 10px;
                }
                `}
            </style>
        </>

    )
}



export default AchBuilder