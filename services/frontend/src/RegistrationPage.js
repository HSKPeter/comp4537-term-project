// src/RegistrationPage.js
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { register } from './auth';

export default function RegistrationPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasCompletedRegistration, setHasCompletedRegistration] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isSuccessful = await register(email, password);
        if (isSuccessful) {
            setHasCompletedRegistration(true);
        } else {
            alert('Registration failed!'); // TODO: Show in modal
        }
    };

    if (hasCompletedRegistration) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            <div>
                <Link to="/login">Login</Link>
            </div>
        </>
    );
}
