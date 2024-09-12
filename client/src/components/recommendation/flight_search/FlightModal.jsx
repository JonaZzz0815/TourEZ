import React, { useState } from 'react';
import './FlightModal.css';

const FlightModal = ({ flight, onClose, onAddToProcedure, onFlightSelect }) => {
    const [selectedFlight, setSelectedFlight] = useState(flight);
    const [showModal, setShowModal] = useState(true);

    const handleAddToProcedure = () => {
        console.log('selectedFlight:', selectedFlight);
        onAddToProcedure(selectedFlight);
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setSelectedFlight(null);
        setShowModal(false);
    };

    const {
        airline_name,
        source_city,
        source_region,
        destination_city,
        destination_region,
        first_flight_airline_name,
        first_flight_source_city,
        first_flight_source_region,
        first_flight_destination_city,
        first_flight_destination_region,
        second_flight_airline_name,
        second_flight_source_city,
        second_flight_source_region,
        second_flight_destination_city,
        second_flight_destination_region,
    } = selectedFlight || {};

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>{airline_name}</h3>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="flight-details">
                        {first_flight_airline_name ? (
                            <>
                                <h4>First Flight</h4>
                                <p>Airline: {first_flight_airline_name}</p>
                                <p>Source: {first_flight_source_city}, {first_flight_source_region}</p>
                                <p>Destination: {first_flight_destination_city}, {first_flight_destination_region}</p>
                                <h4>Second Flight</h4>
                                <p>Airline: {second_flight_airline_name}</p>
                                <p>Source: {second_flight_source_city}, {second_flight_source_region}</p>
                                <p>Destination: {second_flight_destination_city}, {second_flight_destination_region}</p>
                            </>
                        ) : (
                            <>
                                <p>Airline: {airline_name}</p>
                                <p>Source: {source_city}, {source_region}</p>
                                <p>Destination: {destination_city}, {destination_region}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleAddToProcedure}>Add to Itinerary</button>
                </div>
            </div>
        </div>
    );
};

export default FlightModal;