import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import IndexPage from './IndexPage';
import AdminPage from './AdminPage';
import './App.css';

function App() {

  return (
    <Router basename="/COMP4537/ai-project">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<IndexPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
