import { HTTP_STATUS_CODES } from "./utils/httpUtils";

// src/auth.js
const productionApiUrl = 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
const apiUrl = process.env.REACT_APP_SERVER_URL ?? productionApiUrl;

export async function login(email, password) {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized
      throw new Error('Invalid credentials.');
    } else {
      throw new Error('An error occurred.');
    }
  }
}

export async function register(email, password) {
  // Use the environment variable for the backend API endpoint
  const response = await fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const statusCode = response.status;
  return statusCode === HTTP_STATUS_CODES.CREATED;
}