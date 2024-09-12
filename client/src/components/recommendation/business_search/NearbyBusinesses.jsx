import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BusinessButton from './BusinessButton';
import './NearbyBusinesses.css';

const NearbyBusinesses = ({ latitude, longitude, onBusinessClick, onShowModal, onAddToProcedure }) => {
    const [nearbyBusinesses, setNearbyBusinesses] = useState([]);

    useEffect(() => {
        const fetchNearbyBusinesses = async () => {
            try {
                const response = await axios.get('http://localhost:8050/getBusinessByAddr', {
                    params: {
                        latitude,
                        longitude,
                        distance: 10, // Set the desired distance in kilometers
                    },
                });
                console.log('Nearby businesses:', response.data);
                setNearbyBusinesses(response.data);
            } catch (error) {
                console.error('Error fetching nearby businesses:', error);
            }
        };

        fetchNearbyBusinesses();
    }, [latitude, longitude]);

    const handleNearbyBusinessClick = (business) => {
        onBusinessClick(business);
        onShowModal(business, onAddToProcedure);
    };

    return (
        <div>
            <h3>Nearby Businesses</h3>
            {nearbyBusinesses.length > 0 ? (
                nearbyBusinesses.map((business) => (
                    <BusinessButton
                        key={business.business_id}
                        business={business}
                        onBusinessClick={handleNearbyBusinessClick}
                    />
                ))
            ) : (
                <p>No nearby businesses found.</p>
            )}
        </div>
    );
};

export default NearbyBusinesses;