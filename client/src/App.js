import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing_page/LandingPage';
import NavBar from './components/navbar/NavBar';
import Recommendation from './components/recommendation/Recommendation';
import MainPage from './components/main_page/MainPage';
import LoginPage from './components/login/LoginPage';
import Signup from './components/signup/Signup';

const App = () => {
  const handleStartClick = () => {
    window.location.href = '/home';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage onStartClick={handleStartClick} />} />
        <Route path="/states" element={<NavBar />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<LoginPage />}/>
      </Routes>
    </Router>
  );
};

export default App;
