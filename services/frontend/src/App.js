import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import IndexPage from './IndexPage';
import Cookies from 'js-cookie';
import AdminPage from './AdminPage';
import Navbar from './Navbar';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(!!Cookies.get('authToken'));
  const [userRole, setUserRole] = useState(Cookies.get('userRole'));

  const onLogin = (token, role) => {
    Cookies.set('authToken', token);
    Cookies.set('userRole', role);
    setIsAuth(true);
    setUserRole("admin");
  };

  const onLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    setIsAuth(false);
    setUserRole(null);
  }

  return (
    <Router basename="/COMP4537/ai-project">
      <Navbar  userRole={userRole} onLogout={onLogout} />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route
          path="/"
          element={
            isAuth
              ? <IndexPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
