import Collapsible from "../components/Collapsible.tsx";
import {useState} from "react";
import type {AchFile} from "../types/achFile.ts";

function AchViewer() {
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

    const formatToDollar = function(amount: number): string {
        // Create a new Intl.NumberFormat instance for US dollars.
        // 'en-US' specifies the locale for formatting.
        // 'style: 'currency'' indicates currency formatting.
        // 'currency: 'USD'' specifies the currency code for US dollars.
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        // Format the number and return the resulting string.
        return formatter.format(amount);
    }

    return (
        <>
            <h1>ACH Viewer</h1>
            <button onClick={() => fetchAch()}>Load Dummy ACH Data</button>
            {achFile &&
                (
                    <>
                        <Collapsible title={"ACH File"}>
                            <Collapsible title={"File Header"}>
                                <p>Immediate Destination: {achFile.fileHeader.immediateDestination}</p>
                                <p>Immediate Origin: {achFile.fileHeader.immediateOrigin}</p>
                                <p>File Creation Date: {achFile.fileHeader.fileCreationDate}</p>
                                <p>File ID: {achFile.fileHeader.fileIDModifier}</p>
                            </Collapsible>
                            {achFile.batches.map(batch => (
                                <Collapsible key={batch.batchHeader.batchNumber} title={"Batch " + batch.batchHeader.batchNumber}>
                                    <Collapsible title={"Entry Details"}>
                                        {batch.entryDetails.map(entry => (
                                            <p key={entry.traceNumber}>{formatToDollar(entry.amount)}</p>
                                        ))}
                                    </Collapsible>
                                </Collapsible>
                            ))}
                        </Collapsible>
                    </>
                )
            }

            {/*<Collapsible title="User Information">*/}
            {/*    <p>Name: John Doe</p>*/}
            {/*    <p>Email: john@example.com</p>*/}
            {/*    <p>Role: Admin</p>*/}
            {/*    <Collapsible title="Settings" defaultOpen={true}>*/}
            {/*        <p>Theme: Dark Mode</p>*/}
            {/*        <p>Language: English</p>*/}
            {/*    </Collapsible>*/}
            {/*</Collapsible>*/}

            {/*<Collapsible title="Settings" defaultOpen={true}>*/}
            {/*    <p>Theme: Dark Mode</p>*/}
            {/*    <p>Language: English</p>*/}
            {/*</Collapsible>*/}

        </>
    )
}


export default AchViewer