import React from 'react';
import './HotelButton.css';

const HotelButton = ({ hotel, onHotelClick }) => {
    return (
        <div className="hotel-button-container">
            <button className="hotel-button" onClick={() => onHotelClick(hotel)}>
                <div className="hotel-button-content">
                    <div className="hotel-button-icon">
                        <img
                            src={`${process.env.PUBLIC_URL}/${hotel.name}.jpg`}
                            alt={hotel.name}
                            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/default_hotel.jpg`; }}
                        />
                    </div>
                    <div className="hotel-button-text">
                        <div className="hotel-name">{hotel.name}</div>
                        {/* <div className="hotel-description">{hotel.description}</div> */}
                    </div>
                </div>
            </button>
        </div>
    );
};

export default HotelButton;
