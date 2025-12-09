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
        setAchFile(data);
    };

    useEffect(() => {
        fetchAch().catch(error => console.error(error));
    }, [])

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
                    <button
                        onClick={() => {
                            if (achFile) {
                                setAchFile({
                                    ...achFile,
                                    batches: [
                                        ...achFile.batches,
                                        {
                                            batchHeader: {
                                                serviceClassCode: 200,
                                                companyName: "New Companys",
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
                                });
                            }
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        Add Batch
                    </button>
                    {achFile?.batches.map((batch, index) => (
                        <Collapsible key={index} title={`Batch ${batch.batchHeader.batchNumber}`}>
                            <p>Service Class Code: {batch.batchHeader.serviceClassCode}</p>
                            <p>Company Name: {batch.batchHeader.companyName}</p>
                            <p>SEC Code: {batch.batchHeader.standardEntryClassCode}</p>
                        </Collapsible>
                    ))}
                </div>
            </Collapsible>
            <Collapsible title="File Control">
                <p>File Control goes here!</p>
            </Collapsible>
        </>

    )
}

export default AchBuilder