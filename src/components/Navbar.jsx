import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user data (e.g., remove token from localStorage)
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // Redirect to login page
        navigate('/signin');
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/map">EV App</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-link active" aria-current="page" to="/map">Map</Link>
                        <Link className="nav-link" to="#">Community</Link>
                        <Link className="nav-link" to="#">Profile</Link>
                        <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar