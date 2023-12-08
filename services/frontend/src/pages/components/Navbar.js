import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRoleFromCache, removeUserRoleFromCache } from '../../utils/userRoleUtils';
import { axiosInstance, API_PATHS, ROUTER_PATHS } from '../../utils/httpUtils';
import { USER_MESSAGES_EN } from '../../utils/userMessages';
import { useLocation } from 'react-router-dom';


const Navbar = () => {
    const [apiUsage, setApiUsage] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === ROUTER_PATHS.login || !getUserRoleFromCache()) return;
        axiosInstance.get(API_PATHS.apiConsumption).then((response) => {
            let totalConsumption = 0
            response.data.usageStats.forEach((api) => {
                totalConsumption += api.count;
            })
            setApiUsage(totalConsumption);
        }).catch((error) => {
            console.error("Error fetching API usage:", error);
        });
    }, []);

    const onLogout = () => {
        removeUserRoleFromCache();
        axiosInstance.post(API_PATHS.logout);
        navigate(ROUTER_PATHS.login);
    }

    const userRole = getUserRoleFromCache();
    const isInLoginPage = location.pathname === API_PATHS.login;
    return (
        <nav className="navbar">
            {userRole && !isInLoginPage && <p>{USER_MESSAGES_EN.navbar_logged_in_api_usage}{apiUsage}</p>}
            {(!userRole || isInLoginPage) && <Link to="/">{USER_MESSAGES_EN.navbar_link_home}</Link>}
            {userRole && !isInLoginPage && <Link to="/">{USER_MESSAGES_EN.navbar_link_search}</Link>}
            {userRole === 'Admin' && !isInLoginPage && <Link to="/admin">{USER_MESSAGES_EN.navbar_link_admin}</Link>}
            {userRole && !isInLoginPage && <button onClick={onLogout}>{USER_MESSAGES_EN.navbar_button_logout}</button>}
        </nav>
    );
};

export default Navbar;
