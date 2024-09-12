import React, { useEffect, useState } from 'react';
import SingleRadarMap from './SingleRadarMap';
import './RadarMapPanel.css';


/**
 * RadarMapPanel component that displays radar maps for each city in a state or top K cities in a state in a single panel.
 * cityArr or topK must be provided.
 * @param {string} state - the state name
 * @param {string[]} cityArr - an array of city names
 * @param {number} topK - the number of top cities to display
 * @returns {JSX.Element} RadarMapPanel component
 */

export const RadarMapPanel = ({ state, cityArr, topK }) => {

    const [cityDimensionObjs, setCityDimensionObjs] = useState([]);
    const [topKCityDimensionObjs, setTopKCityDimensionObjs] = useState([]);
    console.log(state,cityArr,topK);

    useEffect(() => {
        const fetchTopKCitiesScoresInState = async () => {
            console.log("in topK");
            try {
                const response = await fetch(`http://localhost:8050/topKCityScoresIn/${state}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ topK: topK })
                });
                const data = await response.json();
                setTopKCityDimensionObjs(data.data);
                // const newCheckedCities = new Set(Object.keys(data.data[0]).filter(key => key !== 'dimension'));
                
                // const selectedCities = sessionStorage.getItem('selectedCities') ? JSON.parse(sessionStorage.getItem('selectedCities')) : [];
                // newCheckedCities.forEach(city => {
                //         if (!selectedCities.includes(city)) {
                //             selectedCities.push(city);
                            // document.getElementById(`checkbox-${city}`).checked = true;
                //         }
                //     }
                // );
                // sessionStorage.setItem('selectedCities', JSON.stringify(selectedCities));

            } catch (err) {
                console.error("Error fetching top K cities scores:", err);
            }
        };
        const fetchCityDimensionObjs = async () => {
            // Using Promise.all to wait for all fetch calls to complete
            const promises = cityArr.map(async (city) => {
                const response = await fetch(`http://localhost:8050/cityArrScores/${state}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cityArr: [city] })
                });
                return response.json();
            });
            
            try {
                // Waiting for all promises to resolve and then setting the state once
                const results = await Promise.all(promises);
                setCityDimensionObjs(results);
                console.log("inside fetchCityDimensionObjs" , results);
            } catch (err) {
                console.error("Error fetching city dimension objects:", err);
            }
        };

        if (topK) fetchTopKCitiesScoresInState();
        if (cityArr && cityArr.length > 0) fetchCityDimensionObjs();
    }, [state, cityArr, topK]); // Updated dependencies

    return (
        <div className='radar-map-panel'>
            {cityDimensionObjs.length === 0 && topKCityDimensionObjs.length === 0 && <div>Loading Data...</div>}
            {cityDimensionObjs.length > 0 ? cityDimensionObjs.map((dimensionObj, index) => (
                <SingleRadarMap key={index} dimensionObj={dimensionObj} />
            )) : ""}
            {topKCityDimensionObjs.length > 0 && <SingleRadarMap dimensionObj={topKCityDimensionObjs} />}

        </div>
    );
};

