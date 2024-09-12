import React, { useEffect, useState } from 'react';
import './LeftPanel.css';
import CityButton from './CityButton';

export const LeftPanel = ({ onCitySelect }) => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const fetchSelectedCities = () => {
      const storedCities = JSON.parse(sessionStorage.getItem("selectedCities")) || [];
      setSelectedCities(storedCities);
    };

    fetchSelectedCities();
  }, []);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    onCitySelect(city);
  };

  return (
    <div className="left-panel">
      <h3>Selected Cities</h3>
      {selectedCities.map((city, index) => (
        <CityButton
          key={index}
          city={{ name: city }}
          onCityButtonClick={handleCityClick}
          isSelected={selectedCity === city}
          index={index}
        />
      ))}
    </div>
  );
};