import React, { useState } from 'react';
import './RightPanel.css';
import FlightSearch from '../flight_search/FlightSearch';
import AttractionSearch from '../attraction_search/AttractionSearch';
import BusinessSearch from '../business_search/BusinessSearch';
import HotelSearch from '../hotel_search/HotelSearch';

const RightPanel = ({ selectedCity, onAttractionSelect, onBusinessSelect, onHotelSelect, onFlightSelect, addItemToProcedure }) => {
  const [selectedTab, setSelectedTab] = useState('flight');

  const renderContent = () => {
    switch (selectedTab) {
      case 'flight':
        return <FlightSearch onFlightSelect={onFlightSelect} addItemToProcedure={addItemToProcedure} />;
      case 'attraction':
        return <AttractionSearch selectedCity={selectedCity} onAttractionSelect={onAttractionSelect} addItemToProcedure={addItemToProcedure} />;
      case 'business':
        return <BusinessSearch selectedCity={selectedCity} onBusinessSelect={onBusinessSelect} addItemToProcedure={addItemToProcedure} />;
      case 'hotel':
        return <HotelSearch selectedCity={selectedCity} onHotelSelect={onHotelSelect} addItemToProcedure={addItemToProcedure} />;
      default:
        return null;
    }
  };

  return (
    <div className="right-panel">
      <div className="right-panel-header">
        <div
          className={`header-icon ${selectedTab === 'flight' ? 'active' : ''}`}
          onClick={() => setSelectedTab('flight')}
        >
          Flight
        </div>
        <div
          className={`header-icon ${selectedTab === 'attraction' ? 'active' : ''}`}
          onClick={() => setSelectedTab('attraction')}
        >
          Attraction
        </div>
        <div
          className={`header-icon ${selectedTab === 'business' ? 'active' : ''}`}
          onClick={() => setSelectedTab('business')}
        >
          Business
        </div>
        <div
          className={`header-icon ${selectedTab === 'hotel' ? 'active' : ''}`}
          onClick={() => setSelectedTab('hotel')}
        >
          Hotel
        </div>
      </div>
      <div className="right-panel-content">{renderContent()}</div>
    </div>
  );
};

export default RightPanel;