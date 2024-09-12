import React from 'react';
import states from './states.json'; // Your JSON file with states

const NavBar = () => {
  console.log(states);  // This will show what's in your states data
  return (
    <nav>
      <ul>
        {states.map((state) => (
          <li key={state.abbreviation}>{state.name}</li>
        ))}
      </ul>
    </nav>
  );
};


export default NavBar;

