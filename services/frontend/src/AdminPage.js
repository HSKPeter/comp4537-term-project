import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateToLoginPageIfRoleNotFound } from './utils/securityUtils';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from "./utils/httpUtils";


function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        navigateToLoginPageIfRoleNotFound(navigate, location);
    }, []);

    return (
        <div className='admin-page'>
            <h1>Admin Page</h1>
            <ApiUsageTable apiUsageData={API_USAGE_DATA} />

        </div>
    )
}


function ApiUsageTable(apiUsageData) {
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
                    {apiUsageData.usageStats.map((apiUsage) => (
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

function UsersTable(userData) {

    function removeUser() {
        axiosInstance.delete(API_PATHS.usersInfo, { data: { username: userData.username } })
            .then((response) => {
                if (response.status !== HTTP_STATUS_CODES.OK) {
                    throw new Error('An error occurred.');
                }
            })
            .catch((error) => {
                console.log(error);
            });

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
                    </tr>
                </thead>
                <tbody>
                    {userData.usersInfo.map((user) => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.apiConsumption}</td>
                            <td><button onClick={removeUser}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}


API_USAGE_DATA = {
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

USER_DATA = {
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