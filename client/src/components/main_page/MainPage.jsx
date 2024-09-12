import React, { useState } from "react";
import { LeftPanel } from "../left_panel/LeftPanel";
import { RadarMapPanel } from "../radar_map/RadarMapPanel";
import "./MainPage.css";

export default function MainPage() {
    const [selectedCities, setSelectedCities] = useState([]);
    const [topKCities, setTopKCities] = useState(sessionStorage.getItem('state') || 0);
    const handleNextPageButtonOnClick = () => {
        window.location.href = '/recommendation';
    };
    return (
        <div className="main-container">
            <div className="left-panel">
                <LeftPanel setSelectedCities={setSelectedCities}  setTopK={setTopKCities}/>
            </div>

            {(selectedCities.length!==0 || topKCities !== 0) && <RadarMapPanel state={sessionStorage.getItem('selectedState')} cityArr={selectedCities} topK={topKCities} />}

            {(selectedCities.length > 0 || topKCities > 0) && (
                <button type="submit" className="next-page-btn" onClick={handleNextPageButtonOnClick}>Next Page</button>
            )}
        </div>
    );
}
