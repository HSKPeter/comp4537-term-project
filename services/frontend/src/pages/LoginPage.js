import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../auth';
import { updateUserRoleInCache } from '../utils/userRoleUtils';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isValidInput = () => {
        // Add input validation logic here (e.g., check for empty fields, valid email format)
        if (!email || !username || !password) {
            setErrorMessage('Please fill in all fields.');
            return false;
        }
        // Add more validation rules as required
        return true;
    };

    const handleLogin = async (event) => {
        if (!isValidInput()) return;
        setIsLoading(true);
        try {
            const role = await login(email, username, password);
            updateUserRoleInCache(role);
            navigate('/');
        } catch (error) {
            setErrorMessage("" + error.message + " Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistration = async (event) => {
        if (!isValidInput()) return;
        setIsLoading(true);
        try {
            const role = await register(email, username, password);
            updateUserRoleInCache(role);
            navigate('/');
        } catch (error) {
            setErrorMessage("" + error.message + " Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='login-page' style={styles.loginPage}>
            <div className='login-form' style={styles.loginForm}>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    disabled={isLoading}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    disabled={isLoading}
                />                
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    disabled={isLoading}
                />
                <button style={styles.loginButton} onClick={handleLogin} disabled={isLoading}>Login</button>
                <button style={styles.registrationButton} onClick={handleRegistration} disabled={isLoading}>Registration</button>
                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                {isLoading && <div>Loading...</div>}
            </div>
        </div>
    );
}

// Styles matching the app's dark theme
const styles = {
    loginPage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a', // Dark background
        color: '#f1f1f1', // Light text
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '5px',
        backgroundColor: '#333', // Dark background for form
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
        color: '#fff', // White text color
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff', // Keeping input background white for readability
        color: '#333', // Dark text for inputs
        position: 'relative',
    },
    loginButton: {
        display: 'block',
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    },
    registrationButton: {
        margin: '10px',
        display: 'block',
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    },
    errorMessage: {
        color: 'red', // Red color for error messages
    }
};
