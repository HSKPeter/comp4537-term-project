import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateToLoginPageIfRoleNotFound } from '../utils/securityUtils';
import { API_PATHS, axiosInstance } from "../utils/httpUtils";
import "../styles/AdminPage.css";
import { USER_MESSAGES_EN } from '../utils/userMessages';

function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        navigateToLoginPageIfRoleNotFound(navigate, location);
    }, [navigate, location]);

    return (
        <div className='admin-page'>
            <h1>{USER_MESSAGES_EN.admin_page_title}</h1>
            <ApiUsageTable />
            <UsersTable />
        </div>
    )
}



function ApiUsageTable() {
    const [apiUsageData, setApiUsageData] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(USER_MESSAGES_EN.adming_page_loading);
        axiosInstance.get(API_PATHS.apiStats).then((response) => {
            setApiUsageData(response.data.usageStats);
        }).catch((error) => {
            console.error("Error fetching API usage:", error);
            setMessage(USER_MESSAGES_EN.admin_page_error_api_usage);
        }
        )
    }, [])

    if (!apiUsageData) {
        return (
            <div className='api-usage-table'> {message} </div>
        )
    }
    try {
        return (
            <div className='api-usage-table'>
                <table>
                    <thead>
                        <tr>
                            <th>API Name</th>
                            <th>Request Type</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiUsageData.map((apiUsage, i) => (
                            <tr key={apiUsage['api-name'] + i}>
                                <td>{apiUsage['api-name']}</td>
                                <td>{apiUsage['request-type']}</td>
                                <td>{apiUsage['count']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    } catch (error) {
        console.error("Error rendering API usage table:", error);
        return (
            <div className='api-usage-table'> {USER_MESSAGES_EN.admin_page_error_api_usage} </div>
        )

    }
}


function UsersTable() {
    const [usersInfo, setUsersInfo] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axiosInstance.get(API_PATHS.usersInfo).then((response) => {
            setUsersInfo(response.data.usageStats);
        }).catch((error) => {
            console.error("Error fetching users info:", error);
            setMessage(USER_MESSAGES_EN.admin_page_error_users_info);
        }
        )
    }, [])

    if (!usersInfo) {
        // return table with loading wheel
        return (
            <div className='users-table'> {message} </div>

        )
    }
    try {
        return (
            <div className='users-table'>
                <table className="admin-page-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>API Consumption</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersInfo.map((user) => (
                            <tr key={user.username}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.apiConsumption}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    } catch (error) {
        console.error("Error rendering users table:", error);
        return (
            <div className='users-table'> {USER_MESSAGES_EN.admin_page_error_users_info} </div>
        )

    }
}

export default AdminPage;