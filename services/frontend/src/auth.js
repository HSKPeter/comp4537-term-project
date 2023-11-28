// src/auth.js
export async function login(username, password) {
  // Use the environment variable for the backend API endpoint
  const apiUrl = process.env.REACT_APP_SERVER_URL ?? 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized
      throw new Error('Invalid credentials.');
    } else {
      throw new Error('An error occurred.');
    }
    
  }
  console.log("login request sent")
  const data = await response.json();
  console.log("login request response")
  console.log(data)
  return data.token;
}