import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttractionButton from './AttractionButton';
import './NearbyAttractions.css';

const NearbyAttractions = ({ latitude, longitude, onAttractionClick, onShowModal, onAddToProcedure }) => {
    const [nearbyAttractions, setNearbyAttractions] = useState([]);

    useEffect(() => {
        const fetchNearbyAttractions = async () => {
            try {
                const response = await axios.get('http://localhost:8050/getAttractionsByAddr', {
                    params: {
                        latitude,
                        longitude,
                        distance: 10, // Set the desired distance in kilometers
                    },
                });
                setNearbyAttractions(response.data);
            } catch (error) {
                console.error('Error fetching nearby attractions:', error);
            }
        };

        fetchNearbyAttractions();
    }, [latitude, longitude]);

    const handleNearbyAttractionClick = (attraction) => {
        onAttractionClick(attraction);
        onShowModal(attraction, onAddToProcedure);
    };

    return (
        <div>
            <h3>Nearby Attractions</h3>
            {nearbyAttractions.length > 0 ? (
                nearbyAttractions.map((attraction) => (
                    <AttractionButton
                        key={attraction.OBJECTID}
                        attraction={attraction}
                        onAttractionClick={handleNearbyAttractionClick}
                        index={attraction.OBJECTID}
                    />
                ))
            ) : (
                <p>No nearby attractions found.</p>
            )}
        </div>
    );
};

export default NearbyAttractions;
