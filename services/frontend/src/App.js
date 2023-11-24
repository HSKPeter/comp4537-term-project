import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import IndexPage from './IndexPage';
import Cookies from 'js-cookie';

function App() {
  const [isAuth, setIsAuth] = useState(!!Cookies.get('authToken'));

  const onLogin = (token) => {
    Cookies.set('authToken', token);
    setIsAuth(true);
  };

  const onLogout = () => {
    Cookies.remove('authToken');
    setIsAuth(false);
  }

  return (
    <Router basename="/COMP4537/ai-project">
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route
          path="/"
          element={ 
            isAuth
              ? <IndexPage onLogout={onLogout} />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
