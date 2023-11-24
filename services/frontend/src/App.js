import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import IndexPage from './IndexPage';
import Cookies from 'js-cookie';

function App() {
  const [isAuth, setIsAuth] = useState(!!Cookies.get('authToken'));

  const onLogin = (token) => {
    Cookies.set('authToken', token);
    setIsAuth(true); // Update state to reflect authentication
  };

  // Redirect to the index page if authenticated
  useEffect(() => {
    if (isAuth) {
      window.location.href = '/COMP4537/ai-project'; // Redirect to the base URL or IndexPage
    }
  }, [isAuth]);

  return (
    <Router basename="/COMP4537/ai-project">
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
      </Routes>
    </Router>
  );
}

export default App;