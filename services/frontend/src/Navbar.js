import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRoleFromCache, removeUserRoleFromCache } from './utils/userRoleUtils';

const Navbar = () => {
    const navigate = useNavigate();
    
    const onLogout = () => {
        removeUserRoleFromCache();
        navigate('/login');
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
