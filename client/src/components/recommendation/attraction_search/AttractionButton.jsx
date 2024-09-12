import React from 'react';
import './AttractionButton.css';

const AttractionButton = ({ attraction, onAttractionClick, index }) => {
    return (
        <div className="attraction-button-container">
            <button className="attraction-button" onClick={() => onAttractionClick(attraction)}>
                <div className="attraction-button-content">
                    <div className="attraction-button-icon">
                        <img
                            src={`${process.env.PUBLIC_URL}/cities/${(index % 18) === 0 ? (index % 18) + 17 : (index % 18)}.jpg`}
                            alt={attraction.name}
                            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/default_state_image.jpg`; }}
                        />
                    </div>
                    <div className="attraction-button-text">
                        <div className="attraction-name">{attraction.name}</div>
                        {/* <div className="attraction-description">{attraction.description}</div> */}
                    </div>
                </div>
            </button>
        </div>
    );
};

export default AttractionButton;
