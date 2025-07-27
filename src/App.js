import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChoosePage from './components/ChoosePage';
import BuyBooksPage from './components/BuyBooksPage';
import SellerForm from './components/SellerForm';
import ProfilePage from './components/ProfilePage';
import MyProfilePage from './components/MyProfilePage';
import AppContent from './components/AppContent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/choose" element={<ChoosePage />} />
        <Route path="/buy" element={<BuyBooksPage />} />
        <Route path="/sell" element={<SellerForm />} />
        <Route path="/profile/:rollNumber" element={<ProfilePage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;