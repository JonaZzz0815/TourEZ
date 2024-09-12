const { executeQuery } = require('../config/config.js');

const getAttractionsByCity = async function(req, res) {
  const city = req.query.city;
  const state = req.query.state;

  try {
    const query = `
      SELECT  a.* ,
              ah.longitude, ah.latitude,
              ah.street, ah.zip_code
      FROM AttractionHotelAddr ah
      JOIN ZipCodeAddress z ON z.zip_code = ah.zip_code AND z.city = ?
      JOIN Attraction a ON ah.OBJECTID = a.OBJECTID
    `;
    // ORDER BY a.score
    const data = await executeQuery(query, [city, state]);
    res.json(data);
  } catch (err) {
    console.error('Error in getAttractionsByCity:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttractionsByZipCode = async function(req, res) {
  const zipCode = req.query.zip_code;

  try {
    const query = `
      SELECT a.*,
              ah.longitude, ah.latitude,
              ah.street, ah.zip_code
      FROM AttractionHotelAddr ah
      JOIN Attraction a ON ah.OBJECTID = a.OBJECTID
      WHERE ah.zip_code = ?
    `; //      ORDER BY a.score
    const data = await executeQuery(query, [zipCode]);
    res.json(data);
  } catch (err) {
    console.error('Error in getAttractionsByZipCode:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttractionsByAddr = async function(req, res) {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const filterDistance = req.query.distance ?? 5;
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  try {
    const query = `
      SELECT a.*,
            ah.longitude, ah.latitude,
            ah.street, ah.zip_code,
            ST_Distance_Sphere(POINT(?, ?), POINT(ah.longitude, ah.latitude))/1000.0 AS distance
      FROM Attraction a
      JOIN AttractionHotelAddr ah ON ah.OBJECTID = a.OBJECTID
      HAVING distance < ?
      ORDER BY distance
    `;
    const data = await executeQuery(query, [longitude, latitude, filterDistance]);
    res.json(data);
  } catch (err) {
    console.error('Error in getAttractionsByAddr:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const getAttractionsConcentration = async function(req, res) {
//   const attraction = req.params.attraction;
//   if (!attraction) {
//     throw new Error('Attraction name is required');
//   }

//   try {
//     const query = `
//     WITH AttractionLocation AS (
//       SELECT a.OBJECTID, a.name, ah.longitude, ah.latitude,z.city,z.state
//       FROM Attraction a
//       JOIN AttractionHotelAddr ah ON a.OBJECTID = ah.OBJECTID
//       JOIN ZipCodeAddress z ON z.zip_code = ah.zip_code
//       WHERE a.name = ${attraction}
//     )
//     SELECT al.name as attraction,a.name nearest_attraction,
//         ST_Distance_Sphere(POINT(al.longitude, al.latitude),
//                             POINT(ah.longitude, ah.latitude)) / 1000.0 AS distance
//     FROM AttractionLocation al
//     JOIN AttractionHotelAddr ah ON al.OBJECTID != ah.OBJECTID
//     JOIN ZipCodeAddress z ON ah.zip_code = z.zip_code AND
//                         al.city = z.city And al.state = z.state
//     JOIN Attraction a ON ah.OBJECTID = a.OBJECTID
//     ORDER BY distance
//     LIMIT 1;
//     `;
//     const data = await executeQuery(query, [attraction, attraction]);
//     const distances = data.map(row => row.distance);
//     const totalDistance = distances.reduce((a, b) => a + b, 0);
//     res.json({
//       attraction: attraction,
//       nearestAttractions: data.map(row => row.nearestAttraction),
//       distances: distances,
//       totalDistance: totalDistance
//     });
//   } catch (err) {
//     console.error('Error in getAttractionsConcentration:', err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

module.exports = {
  getAttractionsByCity,
  getAttractionsByZipCode,
  getAttractionsByAddr,
  // getAttractionsConcentration
};
