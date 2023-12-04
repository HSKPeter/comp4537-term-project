import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRoleFromCache, removeUserRoleFromCache } from '../../utils/userRoleUtils';
import { axiosInstance } from '../../utils/httpUtils';

const Navbar = () => {
    const [apiUsage, setApiUsage] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        // axiosInstance.get('/api/stats').then((response) => {
        //     setApiUsage(response.data);
        // }).catch((error) => {
        //     console.error("Error fetching API usage:", error);
        // });
        setApiUsage(100);
    }, []);

    const onLogout = () => {
        removeUserRoleFromCache();
        axiosInstance.post('/logout');
        navigate('/login');
    }


    const userRole = getUserRoleFromCache();
    console.log(userRole);
    return (
        <nav className="navbar">
            {userRole && <p>Logged in. API usage: {apiUsage}</p>}
            {!userRole && <Link to="/">Home</Link>}
            {userRole && <Link to="/">Search</Link>}
            {userRole === 'Admin' && <Link to="/admin">Admin</Link>}
            {userRole && <button onClick={onLogout}>Logout</button>}

            {/* Additional logic for showing different elements based on route and user role */}
        </nav>
    );
};

export default Navbar;
