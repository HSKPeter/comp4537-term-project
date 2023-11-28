import { HTTP_STATUS_CODES } from "./utils/httpUtils";

// src/auth.js
const productionBackendApiUrl = 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL ?? productionBackendApiUrl;

export async function login(username, password) {
  // Use the environment variable for the backend API endpoint
  const response = await fetch(`${backendApiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
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