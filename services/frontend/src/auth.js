// src/auth.js
export async function login(username, password) {
    // Replace with your backend API endpoint
    const response = await fetch('http://your-backend-api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data.token;
  }
  