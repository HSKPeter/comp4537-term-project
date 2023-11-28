import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './auth';

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = await login(username, password);
            if (token) {
                onLogin(token);
                navigate('/');
            }
        } catch (error) {
            setErrorMessage("" + error.message + " Please try again.");
        }
    };

    return (
        <div className='login-page' style={styles.loginPage}>
            <form className='login-form' onSubmit={handleSubmit} style={styles.loginForm}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>
                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
            </form>
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
    button: {
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
