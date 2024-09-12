import React, { useState } from 'react';
import './AttractionModal.css';
import NearbyAttractions from './NearbyAttractions';

const AttractionModal = ({ attraction, onClose, onAddToProcedure, onAttractionSelect }) => {
    const [selectedAttraction, setSelectedAttraction] = useState(attraction);
    const [showNearbyAttractions, setShowNearbyAttractions] = useState(false);
    const [showModal, setShowModal] = useState(true);

    const handleShowNearbyAttractions = () => {
        setShowNearbyAttractions(true);
    };

    const handleCloseNearbyAttractions = () => {
        setShowNearbyAttractions(false);
    };

    const handleNearbyAttractionClick = (newAttraction) => {
        setSelectedAttraction(newAttraction);
        onAttractionSelect(newAttraction);
    };

    const handleAddToProcedure = () => {
        console.log('selectedAttraction:', selectedAttraction);
        onAddToProcedure(selectedAttraction);
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setSelectedAttraction(null);
        setShowModal(false);
        setShowNearbyAttractions(false);
    };

    const {
        name,
        website,
        tourism,
        phone,
        description,
        longitude,
        latitude,
        zipcode,
        street,
    } = selectedAttraction || {};

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
                    <div className="attraction-details">
                        <p>Website: {website || 'N/A'}</p>
                        {website && (
                            <iframe src={website} title={name} width="100%" height="300" frameBorder="0" allowFullScreen />
                        )}
                        <p>Tourism: {tourism || 'N/A'}</p>
                        <p>Phone: {phone || 'N/A'}</p>
                        <p>Description: {description || 'N/A'}</p>
                        <p>Longitude: {longitude}</p>
                        <p>Latitude: {latitude}</p>
                        <p>Zip Code: {zipcode}</p>
                        <p>Street: {street}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleAddToProcedure}>Add to Itinerary</button>
                    <button onClick={handleShowNearbyAttractions}>
                        {'Show Nearby Attractions'}
                    </button>
                </div>
                {showNearbyAttractions && (
                    <NearbyAttractions
                        latitude={latitude}
                        longitude={longitude}
                        onAttractionClick={handleNearbyAttractionClick}
                        onShowModal={handleCloseNearbyAttractions}
                    />
                )}
            </div>
        </div>
    );
};

export default AttractionModal;
