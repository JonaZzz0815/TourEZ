import React from 'react';
import './ProcedureItem.css';

const ProcedureItem = ({ item, index, onRemove }) => {
    const handleRemove = () => {
        onRemove(index);
    };

    const renderItemDetails = () => {
        if (item.airline_id) {
            // Direct flight item
            return (
                <>
                    <p>Airline: {item.airline_name}</p>
                    <p>Source: {item.source_city} ({item.source_iata_code})</p>
                    <p>Destination: {item.destination_city} ({item.destination_iata_code})</p>
                </>
            );
        } else if (item.first_flight_airline_id) {
            // Transit flight item
            return (
                <>
                    <p>First Flight:</p>
                    <p>Airline: {item.first_flight_airline_name}</p>
                    <p>Source: {item.first_flight_source_city} ({item.first_flight_source_iata_code})</p>
                    <p>Destination: {item.first_flight_destination_city} ({item.first_flight_destination_iata_code})</p>
                    <p>Second Flight:</p>
                    <p>Airline: {item.second_flight_airline_name}</p>
                    <p>Source: {item.second_flight_source_city} ({item.second_flight_source_iata_code})</p>
                    <p>Destination: {item.second_flight_destination_city} ({item.second_flight_destination_iata_code})</p>
                </>
            );
        } else if (item.tourism) {
            // Attraction item
            return (
                <>
                    <p>Name: {item.name}</p>
                    <p>Street: {item.street}</p>
                    <p>Zip Code: {item.zip_code}</p>
                </>
            );
        } else if (item.business_id) {
            // Business item
            return (
                <>
                    <p>Name: {item.name}</p>
                    <p>Street: {item.street}</p>
                    <p>Zip Code: {item.zip_code}</p>
                    <p>Rating: {item.stars} stars</p>
                </>
            );
        } else if (item.score) {
            // Hotel item
            return (
                <>
                    <p>Name: {item.name}</p>
                    <p>Street: {item.street}</p>
                    <p>Zip Code: {item.zip_code}</p>
                    <p>Score: {item.score}</p>
                </>
            );
        }
    };

    return (
        <li className="procedure-item">
            <div className="procedure-item-content">
                <h3>{item.name || item.airline_name || `${item.first_flight_airline_name} - ${item.second_flight_airline_name}`}</h3>
                {renderItemDetails()}
            </div>
            <button className="remove-button" onClick={handleRemove}>
                Remove
            </button>
        </li>
    );
};

export default ProcedureItem;