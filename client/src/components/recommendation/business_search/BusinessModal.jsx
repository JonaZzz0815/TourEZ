import React, { useState } from 'react';
import './BusinessModal.css';
import NearbyBusinesses from './NearbyBusinesses';

const BusinessModal = ({ business, onClose, onAddToProcedure, onBusinessSelect }) => {
    const [selectedBusiness, setSelectedBusiness] = useState(business);
    const [showNearbyBusinesses, setShowNearbyBusinesses] = useState(false);
    const [showModal, setShowModal] = useState(true);

    const handleShowNearbyBusinesses = () => {
        setShowNearbyBusinesses(true);
    };

    const handleCloseNearbyBusinesses = () => {
        setShowNearbyBusinesses(false);
    };

    const handleNearbyBusinessClick = (newBusiness) => {
        setSelectedBusiness(newBusiness);
        onBusinessSelect(newBusiness);
    };

    const handleAddToProcedure = () => {
        console.log('selectedBusiness:', selectedBusiness);
        onAddToProcedure(selectedBusiness);
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setSelectedBusiness(null);
        setShowModal(false);
        setShowNearbyBusinesses(false);
    };

    const {
        name,
        street,
        zip_code,
        latitude,
        longitude,
        stars,
        review_count,
    } = selectedBusiness || {};

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
                    <div className="business-details">
                        <p>Street: {street}</p>
                        <p>Zip Code: {zip_code}</p>
                        <p>Latitude: {latitude}</p>
                        <p>Longitude: {longitude}</p>
                        <p>Stars: {stars}</p>
                        <p>Review Count: {review_count}</p>
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

export default BusinessModal;