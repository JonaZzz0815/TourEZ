import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttractionButton from './AttractionButton';
import AttractionModal from './AttractionModal';
import NearbyAttractions from './NearbyAttractions';

const AttractionSearch = ({ selectedCity, onAttractionSelect, addItemToProcedure }) => {
    const [attractions, setAttractions] = useState([]);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showNearbyAttractions, setShowNearbyAttractions] = useState(false);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                if (selectedCity) {
                    const response = await axios.get('http://localhost:8050/getAttractionsByCity', {
                        params: {
                            city: selectedCity,
                        },
                    });
                    setAttractions(response.data);
                } else {
                    setAttractions([]);
                }
            } catch (error) {
                console.error('Error fetching attractions:', error);
            }
        };

        fetchAttractions();
    }, [selectedCity]);

    const handleAttractionClick = (attraction) => {
        setSelectedAttraction(attraction);
        setShowModal(true);
        onAttractionSelect(attraction);
    };

    const handleCloseModal = () => {
        setSelectedAttraction(null);
        setShowModal(false);
        setShowNearbyAttractions(false);
    };

    const handleAddToProcedure = () => {
        addItemToProcedure(selectedAttraction);
        console.log("add in AttractionSearch:", selectedAttraction)
        handleCloseModal();
    };

    const handleShowNearbyAttractions = () => {
        setShowNearbyAttractions(true);
    };

    return (
        <div>
            <h2>Attractions in {selectedCity}</h2>
            {attractions.length > 0 ? (
                attractions.map((attraction) => (
                    <AttractionButton
                        key={attraction.OBJECTID}
                        attraction={attraction}
                        onAttractionClick={handleAttractionClick}
                        index={attraction.OBJECTID}
                    />
                ))
            ) : (
                <p>No attractions found for the selected city.</p>
            )}

            {showModal && selectedAttraction && (
                <AttractionModal
                    attraction={selectedAttraction}
                    onClose={handleCloseModal}
                    onAddToProcedure={handleAddToProcedure}
                    onShowNearbyAttractions={handleShowNearbyAttractions}
                    onAttractionSelect={handleAttractionClick}
                />
            )}

            {showNearbyAttractions && (
                <NearbyAttractions
                    latitude={selectedAttraction.latitude}
                    longitude={selectedAttraction.longitude}
                    onAttractionClick={handleAttractionClick}
                    onShowModal={handleShowNearbyAttractions}
                    onAddToProcedure={handleAddToProcedure}
                />
            )}
        </div>
    );
};

export default AttractionSearch;
