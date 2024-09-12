import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BusinessButton from './BusinessButton';
import BusinessModal from './BusinessModal';
import NearbyBusinesses from './NearbyBusinesses';

const BusinessSearch = ({ selectedCity, onBusinessSelect, addItemToProcedure }) => {
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showNearbyBusinesses, setShowNearbyBusinesses] = useState(false);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                if (selectedCity) {
                    const response = await axios.get('http://localhost:8050/getBusinessByCity', {
                        params: {
                            city: selectedCity,
                            state: sessionStorage.getItem("selectedState")
                        },
                    });
                    setBusinesses(response.data);
                } else {
                    setBusinesses([]);
                }
            } catch (error) {
                console.error('Error fetching businesses:', error);
            }
        };

        fetchBusinesses();
    }, [selectedCity]);

    const handleBusinessClick = (business) => {
        setSelectedBusiness(business);
        setShowModal(true);
        onBusinessSelect(business);
    };

    const handleCloseModal = () => {
        setSelectedBusiness(null);
        setShowModal(false);
        setShowNearbyBusinesses(false);
    };

    const handleAddToProcedure = () => {
        addItemToProcedure(selectedBusiness);
        console.log("add in BusinessSearch:", selectedBusiness);
        handleCloseModal();
    };

    const handleShowNearbyBusinesses = () => {
        setShowNearbyBusinesses(true);
    };

    return (
        <div>
            <h2>Businesses in {selectedCity}</h2>
            {businesses.length > 0 ? (
                businesses.map((business) => (
                    <BusinessButton
                        key={business.business_id}
                        business={business}
                        onBusinessClick={handleBusinessClick}
                    />
                ))
            ) : (
                <p>No businesses found for the selected city.</p>
            )}

            {showModal && selectedBusiness && (
                <BusinessModal
                    business={selectedBusiness}
                    onClose={handleCloseModal}
                    onAddToProcedure={handleAddToProcedure}
                    onShowNearbyBusinesses={handleShowNearbyBusinesses}
                    onBusinessSelect={handleBusinessClick}
                />
            )}

            {showNearbyBusinesses && (
                <NearbyBusinesses
                    latitude={selectedBusiness.latitude}
                    longitude={selectedBusiness.longitude}
                    onBusinessClick={handleBusinessClick}
                    onShowModal={handleShowNearbyBusinesses}
                    onAddToProcedure={handleAddToProcedure}
                />
            )}
        </div>
    );
};

export default BusinessSearch;