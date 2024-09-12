import React, { useState, useRef } from 'react';
import './Recommendation.css';
import { LeftPanel } from './left_panel/LeftPanel';
import RightPanel from './right_panel/RightPanel';
import Procedure from './Procedure/Procedure';


const Recommendation = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const procedureRef = useRef(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };


  const handleAttractionSelect = (attraction) => {
    // Handle attraction selection logic here
  };

  const handleBusinessSelect = (business) => {
    // Handle business selection logic here
  };

  const handleHotelSelect = (hotel) => {
    // Handle hotel selection logic here
  };

  const handleAddItemToProcedure = (item) => {
    procedureRef.current.addItem(item);
  };

  return (
    <div className="recommendation-container">
      <div className="recommendation-left-panel">
        <LeftPanel onCitySelect={handleCitySelect} />
      </div>
      <div className="recommendation-stops">
        <Procedure ref={procedureRef} />
      </div>
      <div className="recommendation-right-panel">
        <RightPanel
          selectedCity={selectedCity}
          onAttractionSelect={handleAttractionSelect}
          onBusinessSelect={handleBusinessSelect}
          onHotelSelect={handleHotelSelect}
          addItemToProcedure={handleAddItemToProcedure}
        />
      </div>
    </div>
  );
};

export default Recommendation;
