import React, { useState } from 'react';
import './HotelModal.css';
import NearbyBusinesses from '../business_search/NearbyBusinesses';

const HotelModal = ({ hotel, onClose, onAddToProcedure, onHotelSelect }) => {
    const [selectedHotel, setSelectedHotel] = useState(hotel);
    const [showNearbyBusinesses, setShowNearbyBusinesses] = useState(false);
    const [showModal, setShowModal] = useState(true);

    const handleShowNearbyBusinesses = () => {
        setShowNearbyBusinesses(true);
    };

    const handleCloseNearbyBusinesses = () => {
        setShowNearbyBusinesses(false);
    };

    const handleNearbyBusinessClick = (newBusiness) => {
        // Handle nearby business click logic here
    };

    const handleAddToProcedure = () => {
        console.log('selectedHotel:', selectedHotel);
        onAddToProcedure(selectedHotel);
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setSelectedHotel(null);
        setShowModal(false);
        setShowNearbyBusinesses(false);
    };

    const {
        OBJECTID,
        amenity,
        attraction,
        bicycle,
        board_type,
        building,
        building_levels,
        description,
        ele,
        historic,
        information,
        name,
        name_en,
        name_es,
        opening_hours,
        operator,
        phone,
        ref,
        source_transform,
        tourism,
        website,
        wheelchair,
        osm_id2,
        longitude,
        latitude,
        street,
        zip_code,
    } = selectedHotel || {};

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>{name}</h3>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="hotel-details">
                        <p>OBJECTID: {OBJECTID}</p>
                        <p>Amenity: {amenity || 'N/A'}</p>
                        <p>Attraction: {attraction || 'N/A'}</p>
                        <p>Bicycle: {bicycle || 'N/A'}</p>
                        <p>Board Type: {board_type || 'N/A'}</p>
                        <p>Building: {building || 'N/A'}</p>
                        <p>Building Levels: {building_levels || 'N/A'}</p>
                        <p>Description: {description || 'N/A'}</p>
                        <p>Elevation: {ele || 'N/A'}</p>
                        <p>Historic: {historic || 'N/A'}</p>
                        <p>Information: {information || 'N/A'}</p>
                        <p>Name: {name || 'N/A'}</p>
                        <p>Name (English): {name_en || 'N/A'}</p>
                        <p>Name (Spanish): {name_es || 'N/A'}</p>
                        <p>Opening Hours: {opening_hours || 'N/A'}</p>
                        <p>Operator: {operator || 'N/A'}</p>
                        <p>Phone: {phone || 'N/A'}</p>
                        <p>Reference: {ref || 'N/A'}</p>
                        <p>Source Transform: {source_transform || 'N/A'}</p>
                        <p>Tourism: {tourism || 'N/A'}</p>
                        <p>Website: {website || 'N/A'}</p>
                        <p>Wheelchair Accessible: {wheelchair || 'N/A'}</p>
                        <p>OSM ID: {osm_id2 || 'N/A'}</p>
                        <p>Longitude: {longitude}</p>
                        <p>Latitude: {latitude}</p>
                        <p>Street: {street}</p>
                        <p>Zip Code: {zip_code}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleAddToProcedure}>Add to Itinerary</button>
                    <button onClick={handleShowNearbyBusinesses}>
                        {'Show Nearby Businesses'}
                    </button>
                </div>
                {showNearbyBusinesses && (
                    <NearbyBusinesses
                        latitude={latitude}
                        longitude={longitude}
                        onBusinessClick={handleNearbyBusinessClick}
                        onShowModal={handleCloseNearbyBusinesses}
                    />
                )}
            </div>
        </div>
    );
};

export default HotelModal;
