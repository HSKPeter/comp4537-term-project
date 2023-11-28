import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import IndexPage from './IndexPage';
import RegistrationPage from './RegistrationPage';


function App() {

  return (
    <Router basename="/COMP4537/ai-project">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<IndexPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
