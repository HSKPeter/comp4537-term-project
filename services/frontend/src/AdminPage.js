import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserRole, getUserRoleFromCache } from './utils/userRoleUtils';



function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function navigateToLoginPageIfRoleNotFound() {
            let role = getUserRoleFromCache();

            if (!role) {
                navigate('/login', { state: { from: location } });
                return;
            }

            role = await getUserRole();
            if (!role) {
                navigate('/login', { state: { from: location } });
                return;
            }
        }

        navigateToLoginPageIfRoleNotFound();
    }, []);
    
    return (
        <div className='admin-page'>
            <h1>Admin Page</h1>
        </div>
    )
}

export default AdminPage;