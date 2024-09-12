import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FlightButton from './FlightButton';
import FlightModal from './FlightModal';

const FlightSearch = ({ addItemToProcedure }) => {
    const [states, setStates] = useState([]);
    const [srcState, setSrcState] = useState('');
    const [srcCities, setSrcCities] = useState([]);
    const [srcCity, setSrcCity] = useState('');
    const [dstState, setDstState] = useState('');
    const [dstCities, setDstCities] = useState([]);
    const [dstCity, setDstCity] = useState('');
    const [flightData, setFlightData] = useState(null);
    const [allowTransit, setAllowTransit] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get('http://localhost:8050/allStates');
                setStates(response.data);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };

        fetchStates();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`http://localhost:8050/citiesInState/${srcState}`);
                setSrcCities(response.data);
            } catch (error) {
                console.error('Error fetching source cities:', error);
            }
        };

        if (srcState) {
            fetchCities();
        }
    }, [srcState]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`http://localhost:8050/citiesInState/${dstState}`);
                setDstCities(response.data);
            } catch (error) {
                console.error('Error fetching destination cities:', error);
            }
        };

        if (dstState) {
            fetchCities();
        }
    }, [dstState]);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8050/getAirlinesByCityName', {
                params: {
                    src_state: srcState,
                    src_city: srcCity,
                    dst_state: dstState,
                    dst_city: dstCity,
                    allow_transit: allowTransit,
                },
            });
            setFlightData(response.data);
            setShowResults(true);
        } catch (error) {
            console.error('Error fetching flight data:', error);
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleFlightClick = (flight) => {
        setSelectedFlight(flight);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedFlight(null);
        setShowModal(false);
    };

    const handleAddToProcedure = () => {
        addItemToProcedure(selectedFlight);
        console.log("add in FlightSearch:", selectedFlight);
        handleCloseModal();
    };

    return (
        <div>
            <h2>Flight Search</h2>
            <div>
                <label>Source State:</label>
                <select value={srcState} onChange={(e) => setSrcState(e.target.value)}>
                    <option value="">Select a state</option>
                    {states.map((state) => (
                        <option key={state.name} value={state.name}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Source City:</label>
                <select value={srcCity} onChange={(e) => setSrcCity(e.target.value)}>
                    <option value="">Select a city</option>
                    {srcCities.map((city) => (
                        <option key={city.name} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Destination State:</label>
                <select value={dstState} onChange={(e) => setDstState(e.target.value)}>
                    <option value="">Select a state</option>
                    {states.map((state) => (
                        <option key={state.name} value={state.name}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Destination City:</label>
                <select value={dstCity} onChange={(e) => setDstCity(e.target.value)}>
                    <option value="">Select a city</option>
                    {dstCities.map((city) => (
                        <option key={city.name} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={allowTransit}
                        onChange={(e) => setAllowTransit(e.target.checked)}
                    />
                    Allow Transit Flights
                </label>
            </div>
            <button onClick={handleSearch}>Search Flights</button>

            {showResults && flightData && (
                <div>
                    <h3>Flights from {srcCity} to {dstCity}</h3>
                    {(flightData.direct && flightData.direct.length === 0 && (!allowTransit || (flightData.transit && flightData.transit.length === 0))) ? (
                        <p>No flights available for the selected cities.</p>
                    ) : (
                        <>
                            {flightData.direct && flightData.direct.length > 0 && (
                                <>
                                    <h4>Direct Flights:</h4>
                                    {flightData.direct.map((flight, index) => (
                                        <FlightButton
                                            key={index}
                                            flight={flight}
                                            onFlightClick={handleFlightClick}
                                        />
                                    ))}
                                </>
                            )}

                            {allowTransit && flightData.transit && flightData.transit.length > 0 && (
                                <>
                                    <h4>Transit Flights:</h4>
                                    {flightData.transit.map((flight, index) => (
                                        <FlightButton
                                            key={index}
                                            flight={flight}
                                            onFlightClick={handleFlightClick}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {showModal && selectedFlight && (
                <FlightModal
                    flight={selectedFlight}
                    onClose={handleCloseModal}
                    onAddToProcedure={handleAddToProcedure}
                />
            )}

            <button onClick={handleBack}>Back</button>
        </div>
    );
};

export default FlightSearch;