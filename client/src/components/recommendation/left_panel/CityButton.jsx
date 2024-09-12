import React from "react";
import "./CityButton.css";

const CityButton = ({ city, onCityButtonClick, isSelected, index }) => {
  return (
    <div className="city-button-container">
      <label htmlFor={`checkbox-${city.name}`} className="city-button">
        <div className="city-button-content">
          <div className="city-button-icon">
            <img
              src={`${process.env.PUBLIC_URL}/cities/${(index % 18) === 0 ? (index % 18) + 17 : (index % 18)}.jpg`}
              alt={city.name}
              onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/default_state_image.jpg`; }}
            />
          </div>
          <div className="city-button-text">
            <div className="city-name">{city.name}</div>
          </div>
        </div>
        <input
          type="checkbox"
          id={`checkbox-${city.name}`}
          className="city-checkbox"
          checked={isSelected}
          onChange={() => onCityButtonClick(city.name)}
        />
      </label>
    </div>
  );
};

export default CityButton;