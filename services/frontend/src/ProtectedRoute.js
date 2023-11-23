// src/ProtectedRoute.js
import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = Cookies.get('authToken');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}
