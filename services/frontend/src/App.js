import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import IndexPage from './pages/IndexPage';
import AdminPage from './pages/AdminPage';
import './styles/App.css';

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
