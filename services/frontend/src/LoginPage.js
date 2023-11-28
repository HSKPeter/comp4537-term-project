// src/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from './auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isSuccessful = await login(email, password);
        if (isSuccessful) {
            alert('Login successful!');
        } else {
            alert('Login failed!'); // TODO: Show in modal
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
                <button type="submit">Login</button>
            </form>
            <div>
                <Link to="/register">Register</Link>
            </div>
        </>
    );
}
