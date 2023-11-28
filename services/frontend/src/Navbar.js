import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ userRole, onLogout }) => {
    const location = useLocation();

    console.log("userRole: ", userRole)

    return (
        <nav className="navbar">
            {!userRole && <Link to="/">Home</Link>}
            {userRole && <Link to="/">Search</Link>}
            {userRole === 'admin' && <Link to="/admin">Admin</Link>}
            {userRole && <button onClick={onLogout}>Logout</button>}

            {/* Additional logic for showing different elements based on route and user role */}
        </nav>
    );
};

export default Navbar;
