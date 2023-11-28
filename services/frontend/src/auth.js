import { HTTP_STATUS_CODES } from "./utils/httpUtils";

// src/auth.js
const productionBackendApiUrl = 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL ?? productionBackendApiUrl;

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

export async function register(email, password) {
  // Use the environment variable for the backend API endpoint
  const response = await fetch(`${backendApiUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const statusCode = response.status;
  return statusCode === HTTP_STATUS_CODES.CREATED;
}