import Collapsible from "../components/Collapsible.tsx";
import {useState} from "react";
import type {AchFile} from "../types/achFile.ts";

function AchViewer() {
    const [achFile, setAchFile] = useState<AchFile>();

    const fetchItems = async () => {
        console.log('Fetching data...');
        const response = await fetch('http://localhost:8080/sample-ach-json');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setAchFile(data);
    };

    return (
        <>
            <h1>ACH Viewer</h1>
            <button onClick={() => fetchItems()}>Load Dummy ACH Data</button>
            {achFile &&
                (
                    <>
                        <Collapsible title="User Information">
                            <p>Name: John Doe</p>
                            <p>Email: john@example.com</p>
                            <p>Role: Admin</p>
                            <Collapsible title="Settings" defaultOpen={true}>
                                <p>Theme: Dark Mode</p>
                                <p>Language: English</p>
                            </Collapsible>
                        </Collapsible>

                        <Collapsible title="Settings" defaultOpen={true}>
                            <p>Theme: Dark Mode</p>
                            <p>Language: English</p>
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