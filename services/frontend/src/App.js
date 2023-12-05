import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import IndexPage from './pages/IndexPage';
import AdminPage from './pages/AdminPage';
import './styles/App.css';
import Navbar from './pages/components/Navbar';
import { ROUTER_PATHS } from './utils/httpUtils';

function App() {
  return (

    <Router basename="/COMP4537/ai-project">
      <Navbar />
      <Routes>
        <Route path={ROUTER_PATHS.login} element={<LoginPage />} />
        <Route path={ROUTER_PATHS.index} element={<IndexPage />} />
        <Route path={ROUTER_PATHS.admin} element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
