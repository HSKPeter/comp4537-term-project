import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateToLoginPageIfRoleNotFound } from './utils/securityUtils';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from "./utils/httpUtils";
import "./AdminPage.css";

function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [apiUsageData, setApiUsageData] = useState([]);
    const [usersInfo, setUsersInfo] = useState([]);

    useEffect(() => {
        navigateToLoginPageIfRoleNotFound(navigate, location);
        // setApiUsageData(axiosInstance.get(API_PATHS.apiStats)); // comment back in when backend endoints are ready
        // setUsersInfo(axiosInstance.get(API_PATHS.usersInfo));    // comment back in when backend endoints are ready
        setApiUsageData(API_USAGE_DATA); // delete when backend endoints are ready
        setUsersInfo(USER_DATA);    // delete when backend endoints are ready

    }, []);

    return (
        <div className='admin-page'>
            <h1>Admin Page</h1>
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
    function removeUser(username) {
        axiosInstance.delete(API_PATHS.deleteUser, { username: username })
            .then((response) => {
                if (response.status === HTTP_STATUS_CODES.OK) {
                    alert('User deleted successfully.');
                } else {
                    alert('An error occurred. Was not able to delete user.');
                }
            })
            .catch((error) => {
                alert('An error occurred when connecting to server.', error.message);
            });

    }
    if (!usersInfo) {
        // return table with loading wheel
        return (
            <div className='users-table'> LOADING </div>

        )
    }
    return (
        <div className='users-table'>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>API Consumption</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usersInfo.map((user) => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.apiConsumption}</td>
                            <td><button onClick={() => removeUser(user.username)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}



const API_USAGE_DATA = {
    "usageStats": [
        {
            "api-name": "API 1",
            "request-type": "GET",
            "count": 100
        },
        {
            "api-name": "API 2",
            "request-type": "POST",
            "count": 75
        },
        {
            "api-name": "API 3",
            "request-type": "GET",
            "count": 120
        },
        {
            "api-name": "API 4",
            "request-type": "PUT",
            "count": 50
        }
    ]
}

const USER_DATA = {
    "users-info": [
        {
            "username": "user1",
            "email": "user1@example.com",
            "role": "admin",
            "apiConsumption": 150
        },
        {
            "username": "user2",
            "email": "user2@example.com",
            "role": "user",
            "apiConsumption": 80
        },
        {
            "username": "user3",
            "email": "user3@example.com",
            "role": "user",
            "apiConsumption": 120
        },
        {
            "username": "user4",
            "email": "user4@example.com",
            "role": "admin",
            "apiConsumption": 200
        }
    ]
}



export default AdminPage;