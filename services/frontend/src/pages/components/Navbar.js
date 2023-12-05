import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRoleFromCache, removeUserRoleFromCache } from '../../utils/userRoleUtils';
import { axiosInstance, API_PATHS } from '../../utils/httpUtils';
import { USER_MESSAGES_EN } from '../../utils/userMessages';


const Navbar = () => {
    const [apiUsage, setApiUsage] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get(API_PATHS.apiConsumption).then((response) => {
            setApiUsage(response.data);
        }).catch((error) => {
            console.error("Error fetching API usage:", error);
        });
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
            {userRole && <p>{USER_MESSAGES_EN.navbar_logged_in_api_usage}{apiUsage}</p>}
            {!userRole && <Link to="/">{USER_MESSAGES_EN.navbar_link_home}</Link>}
            {userRole && <Link to="/">{USER_MESSAGES_EN.navbar_link_search}</Link>}
            {userRole === 'Admin' && <Link to="/admin">{USER_MESSAGES_EN.navbar_link_admin}</Link>}
            {userRole && <button onClick={onLogout}>{USER_MESSAGES_EN.navbar_button_logout}</button>}
        </nav>
    );
};

export default Navbar;
