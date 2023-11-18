import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import IndexPage from './IndexPage';
import Cookies from 'js-cookie';


const onLogin = (token) => {
  Cookies.set('authToken', token);
  // Redirect to index page
};

const SERVER = 'http://localhost:3000';

function App() {
  const isAuthenticated = () => !!Cookies.get('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <IndexPage />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
