import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateToLoginPageIfRoleNotFound } from '../utils/securityUtils';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from "../utils/httpUtils";
import "../styles/AdminPage.css";
import { USER_MESSAGES_EN } from '../utils/userMessages';

function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [apiUsageData, setApiUsageData] = useState([]);
    const [usersInfo, setUsersInfo] = useState([]);

    useEffect(() => {
        navigateToLoginPageIfRoleNotFound(navigate, location);
        axiosInstance.get(API_PATHS.apiStats).then((response) => {
            if (response.status === HTTP_STATUS_CODES.OK) {
                setApiUsageData(response.data);
            } else {
                alert(USER_MESSAGES_EN.admin_page_error_api_usage);
            }
        })
        axiosInstance.get(API_PATHS.usersInfo).then((response) => {
            if (response.status === HTTP_STATUS_CODES.OK) {
                setUsersInfo(response.data);
            } else {
                alert(USER_MESSAGES_EN.admin_page_error_users_info);
            }
        })
    }, []);

    return (
        <div className='admin-page'>
            <h1>{USER_MESSAGES_EN.admin_page_title}</h1>
            <ApiUsageTable apiUsageData={apiUsageData.usageStats} />
            <UsersTable usersInfo={usersInfo['users-info']} />
        </div>
    )
}



function ApiUsageTable({ apiUsageData }) {
    console.log(apiUsageData)
    if (!apiUsageData) {
        // return table with loading wheel
        return (
            <div className='api-usage-table'> LOADING </div>

        )
    }
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
                    {apiUsageData.map((apiUsage) => (
                        <tr key={apiUsage['api-name']}>
                            <td>{apiUsage['api-name']}</td>
                            <td>{apiUsage['request-type']}</td>
                            <td>{apiUsage['count']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}


function UsersTable({ usersInfo }) {
    if (!usersInfo) {
        // return table with loading wheel
        return (
            <div className='users-table'> LOADING </div>

        )
    }
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

}



export default AdminPage;