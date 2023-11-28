import { HTTP_STATUS_CODES } from "./utils/httpUtils";
import axios from "axios";

// src/auth.js
const productionApiUrl = 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
const apiUrl = process.env.REACT_APP_SERVER_URL ?? productionApiUrl;

export async function login(email, password) {
  const response = await axios.post(`${apiUrl}/login`, { email, password }, {
    withCredentials: true,
  });

  if (response.status !== HTTP_STATUS_CODES.OK) {
    if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      throw new Error('Invalid credentials.');
    } else {
      throw new Error('An error occurred.');
    }
  }
}

export async function register(email, password) {
  const response = await axios.post(`${apiUrl}/register`, { email, password }, {
    withCredentials: true,
  });

  const statusCode = response.status;
  return statusCode === HTTP_STATUS_CODES.CREATED;
}