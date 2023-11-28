import React from 'react';
import { Link } from 'react-router-dom';
import { getUserRole, getUserRoleFromCache } from './utils/userRoleUtils';

const Navbar = () => {
    const onLogout = () => {
        // TODO
    }
    const userRole = getUserRoleFromCache();

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
