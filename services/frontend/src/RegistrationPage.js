// src/RegistrationPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from './auth';

export default function RegistrationPage({ onRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isSuccessful = await register(email, password);
        if (isSuccessful) {
            navigate('/');
            return;
        } else {
            alert('Registration failed!'); // TODO: Show in modal
        }
    };

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
