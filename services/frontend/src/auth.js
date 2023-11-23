// src/auth.js
export async function login(username, password) {
  // Use the environment variable for the backend API endpoint
  const apiUrl = process.env.SERVER
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  return data.token;
}