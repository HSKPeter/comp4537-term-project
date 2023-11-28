import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from "./utils/httpUtils";

// src/auth.js

export async function login(email, password) {
  const response = await axiosInstance.post(API_PATHS.login, { email, password });

  if (response.status !== HTTP_STATUS_CODES.OK) {
    if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      throw new Error('Invalid credentials.');
    } else {
      throw new Error('An error occurred.');
    }
  }
}

export async function register(email, password) {
  const response = await axiosInstance.post(API_PATHS.register, { email, password });

  const statusCode = response.status;
  return statusCode === HTTP_STATUS_CODES.CREATED;
}