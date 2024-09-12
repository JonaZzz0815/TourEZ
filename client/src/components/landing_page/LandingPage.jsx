import React from 'react';
import './LandingPage.css';
const LandingPage = ({ onStartClick }) => {
  return (
    <div style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/pexels-simon-rizzi-1809644.jpg)`, // Corrected path
      height: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center' // Ensures the image is centered
    }}>

      <button className="landing-page-button" onClick={onStartClick}>
        Start Planning Trip
      </button>
    </div>
  );
};

export default LandingPage;
