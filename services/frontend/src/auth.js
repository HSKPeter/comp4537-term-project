import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from "./utils/httpUtils";

// src/auth.js

export async function login(email, username, password) {
  const response = await axiosInstance.post(API_PATHS.login, { email, username, password });

  if (response.status !== HTTP_STATUS_CODES.OK) {
    if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      throw new Error('Invalid credentials.');
    } else {
      throw new Error('An error occurred.');
    }
  }

  const { role } = response.data;
  return role;
}

export async function register(email, username, password) {
  const response = await axiosInstance.post(API_PATHS.register, { email, username, password });

  if (response.status !== HTTP_STATUS_CODES.CREATED) {
    throw new Error('An error occurred.');
  }

  const { role } = response.data;
  return role;
}