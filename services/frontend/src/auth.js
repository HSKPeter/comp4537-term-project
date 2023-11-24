// src/auth.js
export async function login(username, password) {
  // Use the environment variable for the backend API endpoint
  const apiUrl = process.env.SERVER ?? 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
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