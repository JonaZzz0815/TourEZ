import React, { useEffect, useState } from 'react';
import './LeftPanel.css';
import StateButton from './StateButton';
import CityButton from './CityButton';

export const LeftPanel = ({ setSelectedCities, setTopK }) => {
    const [statesArr, setStatesArr] = useState([]);
    const [citiesArr, setCitiesArr] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [localSelectedCities, setLocalSelectedCities] = useState(new Set(
        sessionStorage.getItem('selectedCities') ? JSON.parse(sessionStorage.getItem('selectedCities')) : []
    ));
    const [searchTerm, setSearchTerm] = useState('');
    const [stateSearchTerm, setStateSearchTerm] = useState('');

    const availableTopK = [0, 1, 2, 3];

    useEffect(() => {
        async function fetchAllStates() {
            const response = await fetch('http://localhost:8050/allStates');
            const data = await response.json();
            setStatesArr(data);
        }
        fetchAllStates();
    }, []);

    useEffect(() => {
        async function fetchCitiesByState(state) {
            const response = await fetch(`http://localhost:8050/citiesInState/${state}`);
            const data = await response.json();
            data.sort((a, b) => a.name.localeCompare(b.name));
            setCitiesArr(data);
        }
        if (selectedState) fetchCitiesByState(selectedState);
    }, [selectedState]);

    useEffect(() => {
        setSelectedCities([...localSelectedCities]);
        sessionStorage.setItem('selectedCities', JSON.stringify([...localSelectedCities]));
        if (sessionStorage.getItem('selectedState')) {
            setSelectedState(sessionStorage.getItem('selectedState'));
        }
    }, [localSelectedCities]);

    const onLeftPanelStateButtonClick = state => {
        setSelectedState(state.name);
        sessionStorage.setItem('selectedState', state.name);
    };

    const handleCityCheckboxChange = cityName => {
        setLocalSelectedCities(prev => {
            const updated = new Set(prev);
            if (updated.has(cityName)) {
                updated.delete(cityName);
            } else {
                updated.add(cityName);
            }
            return updated;
        });
    };

    const handleCityBackButtonClick = () => {
        setSelectedState(null);
        sessionStorage.removeItem('selectedState');
        sessionStorage.removeItem('selectedCities');
        setLocalSelectedCities(new Set());
        setSelectedCities([]);
        setTopK(0);
        setSearchTerm('');
        setStateSearchTerm('');
    };

    return (
        <div className="left-panel">
            {selectedState ? (
                <div className='left-panel-cities-container'>
                    <div className='left-panel-header'>
                        <span>{selectedState} Cities</span>
                        <button id='city-back-button' onClick={handleCityBackButtonClick}>Back</button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search City"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="city-search-bar"
                    />
                    <div className='left-panel-top-k-container'>
                        <p>show top </p>
                        <select onChange={e => setTopK(Number(e.target.value))} className='left-panel-top-k-selector'>
                            {availableTopK.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <p>cities </p>
                    </div>
                    {citiesArr.filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase())).map((city, index) => (
                        <CityButton
                            key={city.name}  // use city.name as key
                            city={city}
                            onCityButtonClick={() => handleCityCheckboxChange(city.name)}
                            isSelected={localSelectedCities.has(city.name)}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Search State"
                        value={stateSearchTerm}
                        onChange={e => setStateSearchTerm(e.target.value)}
                        className="state-search-bar"
                        style={{ marginBottom: '4px',border:'1px solid grey', opacity: '0.8'}}
                    />
                    {statesArr.filter(state => state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())).map((state, index) => (
                        <StateButton
                            key={index}
                            state={state}
                            onStateButtonClick={onLeftPanelStateButtonClick}
                            index={index}
                        />
                    ))}
                </>
            )}
        </div>
    );
};
