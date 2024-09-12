import React from "react";
import "./StateButton.css"; 

const StateButton = ({ state, onStateButtonClick,index }) => {
  return (
    <div className="state-button-container">
      <button 
        className="state-button"
        onClick={() => onStateButtonClick(state)}
      >
        <div className="state-button-content">
          <div className="state-button-icon">
          <img 
            src={`${process.env.PUBLIC_URL}/states/${(index%18) === 0 ? (index%18)+17 : (index%18)}.jpg`} 
            alt={state.name}
            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/default_img.jpg`; }}
          />
          </div>

          <div className="state-button-text">
            <div className="state-name">{state.name}</div>
            <div className="state-button-slogan">{state.slogan}</div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default StateButton;
