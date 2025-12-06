import { useState } from 'react';
import './Collapsible.css';

interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="collapsible">
            <button
                className="collapsible-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                <span className="collapsible-icon">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div className="collapsible-content">
                    {children}
                </div>
            )}
        </div>
    );
}

export default Collapsible;