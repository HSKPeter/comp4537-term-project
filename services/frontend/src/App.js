import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import IndexPage from './IndexPage';
import AdminPage from './AdminPage';
import Navbar from './Navbar';
import './App.css';
import RegistrationPage from './RegistrationPage';

function App() {
  return (
    <Router basename="/COMP4537/ai-project">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<IndexPage />}/>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
