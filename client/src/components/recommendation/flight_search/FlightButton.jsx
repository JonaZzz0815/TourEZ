import React from 'react';
import './FlightButton.css';

const FlightButton = ({ flight, onFlightClick }) => {
    const renderFlightDetails = () => {
        if (flight.airline_id) {
            // Direct flight
            return (
                <>
                    <div className="airline-name">{flight.airline_name}</div>
                    <div className="flight-route">{flight.source_city} to {flight.destination_city}</div>
                </>
            );
        } else {
            // Transit flight
            return (
                <>
                    <div className="airline-name">{flight.first_flight_airline_name}</div>
                    <div className="flight-route">{flight.first_flight_source_city} to {flight.first_flight_destination_city}</div>
                    <div className="airline-name">{flight.second_flight_airline_name}</div>
                    <div className="flight-route">{flight.second_flight_source_city} to {flight.second_flight_destination_city}</div>
                </>
            );
        }
    };

    const getAirlineImage = () => {
        if (flight.airline_id) {
            // Direct flight
            return `${process.env.PUBLIC_URL}/${flight.airline_name}.jpg`;
        } else {
            // Transit flight
            return `${process.env.PUBLIC_URL}/${flight.first_flight_airline_name}.jpg`;
        }
    };

    return (
        <div className="flight-button-container">
            <button className="flight-button" onClick={() => onFlightClick(flight)}>
                <div className="flight-button-content">
                    <div className="flight-button-icon">
                        <img
                            src={getAirlineImage()}
                            alt={flight.airline_id ? flight.airline_name : flight.first_flight_airline_name}
                            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/default_flight.jpg`; }}
                        />
                    </div>
                    <div className="flight-button-text">
                        {renderFlightDetails()}
                    </div>
                </div>
            </button>
        </div>
    );
};

export default FlightButton;