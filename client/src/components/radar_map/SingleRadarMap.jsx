import React from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Legend
} from 'recharts';
import './SingleRadarMap.css'

const SingleRadarMap = ({ dimensionObj }) => {
    if (!dimensionObj || dimensionObj.length === 0) {
        console.log("No or empty dimension object passed to SingleRadarMap");
        return <p>No data available.</p>;
    }
    const cityNames = Object.keys(dimensionObj[0]).filter(k => k !== 'dimension');
    console.log("Received dimensions: ", dimensionObj);

    return (
        <ResponsiveContainer>
            <RadarChart outerRadius="80%" data={dimensionObj}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" />
                <PolarRadiusAxis angle={0} domain={[0, 1]} />
                {cityNames.map((cityName, index) => (
                    <Radar
                        key={cityName}
                        name={cityName}
                        dataKey={cityName}
                        stroke={getColor(index)}
                        fill={getColor(index)}
                        fillOpacity={0.6}
                    />
                ))}
                {cityNames.length >= 2 ? <Legend /> : <Legend payload={[{ value: cityNames[0], type: 'line' }]} />}
            </RadarChart>
        </ResponsiveContainer>
    );
};

function getColor(index) {
    const colorPalette = ['#E41A1C', '#377EB8', '#4DAF4A', '#984EA3', '#FF7F00'];
    return index < colorPalette.length ? colorPalette[index] : `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default SingleRadarMap;


// import React, { useEffect } from 'react';
// import {
//   Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
//   ResponsiveContainer, Legend
// } from 'recharts';
// import './SingleRadarMap.css';

// const SingleRadarMap = ({state, city, topK}) => {

//     let cityScores = null;
//     let cityNames = null;

//     cityScores = [
//         {"dimension": 'hotels', 'city1': 0.3, 'city2': 0.9, 'city3': 0.7},
//         {"dimension": 'food', 'city1': 0.5, 'city2': 0.6, 'city3': 0.7},
//         {"dimension": 'attractions', 'city1': 0.8, 'city2': 0.4, 'city3': 0.7},
//         {"dimension": 'entertainments', 'city1': 0.4, 'city2': 0.6, 'city3': 0.3}
//     ];
//     cityNames = Object.keys(cityScores[0]).filter(k => k !== 'dimension');

//     if (state === null) {
//         throw new Error('State is required for RadarMap');
//     } else if (city === null && topK === null) {
//         throw new Error('Either city or topK must be provided');
//     }

//     // useEffect(() => {
//     //     const fetchCityScores = async () => {
//     //         try{
//     //             if (state === null) {
//     //                 throw new Error('State is null');
//     //             }
//     //             const response = await fetch(`http://localhost:8050//getAllCityScoresInState/${state}`);
//     //             const data = await response.json(); // an array of city objects with 4 dimensions: 'hotels', 'food', 'attractions', 'entertainments',and city.name
//     //             cityScores = data;
//     //         }
//     //         catch(err) {
//     //             console.error("Error fetching state city scorer" + err);
//     //         }
//     //     }  
//     //     fetchCityScores();
//     // })

//     return (
//     <div className="radar-map-container"> {/* Use the class for styling */}
//       <ResponsiveContainer className="responsive-container">
//         <RadarChart outerRadius={100} data={cityScores} className="radar-chart">
//           <PolarGrid />
//           <PolarAngleAxis dataKey="dimension" />
//           <PolarRadiusAxis angle={30} domain={[0, 1]} />
//           {cityNames.map((cityName, index) => {
//             if (cityName === 'dimension') {
//               return null;
//             }
//             const color = getColor(index);
//             return (
//               <Radar
//                 key={cityName}
//                 name={cityName}
//                 dataKey={cityName}
//                 stroke={color}
//                 fill={color}
//                 fillOpacity={0.5}
//               />
//             );
//           })}
//           <Legend className="radar-legend" />
//         </RadarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };


// function getColor(index) {
//     const colorPalette = ['#b3ecec', '#ead6ff', '#d2e8d5','	#f4cbd3', '#f9d5c1']

//     if (index < colorPalette.length) {
//         return colorPalette[index];
//     }
//     let color = '#';
//     for (let i = 0; i < 3; i++) {
//         color += ('0' + ((Math.random() * 128 + 127) | 0).toString(16)).slice(-2);
//     }
//   return color;
// }


// export default SingleRadarMap;
