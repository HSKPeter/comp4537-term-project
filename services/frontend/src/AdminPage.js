import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateToLoginPageIfRoleNotFound } from './utils/securityUtils';


function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        navigateToLoginPageIfRoleNotFound(navigate, location);
    }, []);
    
    return (
        <div className='admin-page'>
            <h1>Admin Page</h1>
        </div>
    )
}

export default AdminPage;