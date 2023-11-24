// src/auth.js
export async function login(username, password) {
  // Use the environment variable for the backend API endpoint
  console.log("sending login request to backend")
  console.log(process.env.SERVER)
  const apiUrl = process.env.SERVER ?? 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  }
  console.log("login request sent")
  const data = await response.json();
  console.log("login request response")
  console.log(data)
  return data.token;
}