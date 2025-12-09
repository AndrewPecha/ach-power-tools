import './Nav.css';

function Nav() {
    return (
        <nav className="nav">
            <ul className="nav-list">
                <li className="nav-item">
                    <a href="/" className="nav-link">Home</a>
                </li>
                <li className="nav-item">
                    <a href="/ach-builder" className="nav-link">ACH Builder</a>
                </li>
                <li className="nav-item">
                    <a href="/ach-viewer" className="nav-link">ACH Viewer</a>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
