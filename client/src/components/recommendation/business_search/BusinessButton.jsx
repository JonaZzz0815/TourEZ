import React from 'react';
import './BusinessButton.css';

const BusinessButton = ({ business, onBusinessClick }) => {
    return (
        <div className="business-button-container">
            <button className="business-button" onClick={() => onBusinessClick(business)}>
                <div className="business-button-content">
                    <div className="business-button-icon">
                        <img
                            src={`${process.env.PUBLIC_URL}/${business.name}.jpg`}
                            alt={business.name}
                            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/default_business.jpeg`; }}
                        />
                    </div>
                    <div className="business-button-text">
                        <div className="business-name">{business.name}</div>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default BusinessButton;