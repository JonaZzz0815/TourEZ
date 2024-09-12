const {getDBConnection, executeQuery} = require('../config/config.js');

// const connection = getDBConnection();

//
const getBusinessByCity = async function(req, res) {
  const city = req.query.city;
  const state = req.query.state;
 // TODO
 try{
  const query = `
  SELECT b.*
  FROM Businesses b
  JOIN ZipCodeAddress z on z.zip_code = b.zip_code 
  WHERE z.city = ? and z.state = ?

 `;
 //filterDistance
 const data = await executeQuery(query,[city, state]);
 res.json(data);
 }catch(error){
    console.error('Error in getBusinessByCity:', error);
    res.status(500).json({ error: "Internal Server Error" });
 }

  
}

const getBusinessByZipCode = async function(req, res) {
  const zipCode = req.query.zip_code;
//TODO: Add query to get the attractions in the given zip code
  try{
    const query = `
    Select b.*
    from Businesses b
    WHERE b.zip_code = ?
    ORDER BY a.score
    `;
    const data = await executeQuery(query,[zipCode]);
    res.json(data);
  }catch (err) {
    console.error('Error in getBusinessByZipCode:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
};

const getBusinessByAddr = async function(req, res) {

  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const filterDistance = req.query.distance ?? 5;

  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }
  //TODO: change the query to get the nearest attractions to the given latitude and longitude
  try {
    const query = `
    SELECT b.*,
    ST_Distance_Sphere(POINT(?, ?), POINT(b.longitude, b.latitude)) / 1000.0 AS distance
      FROM Businesses b
      HAVING distance < ?
    ORDER BY distance
  `;
    const data = await executeQuery(query,[longitude,latitude,filterDistance]);
  
    res.json(data);
  } catch (err){
    console.error('Error in getBusinessByAddr:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
}

// const getBusinessReview = async function(req, res) {
// const attraction = req.params.attraction;
// if (!attraction) {
//     throw new Error('Attraction name is required');
// }
// //TODO: Add query to get reviews for the business
// connection.query(`
    
// `, [attraction, attraction], (err, data) => {
//     if (err) {
//     console.log(err);
//     res.json({ error: 'Error fetching data' });
//     } else {
//     const distances = data.map(row => row.distance);
//     const totalDistance = distances.reduce((a, b) => a + b, 0);
//     res.json({
//         attraction: attraction,
//         nearestAttractions: data.map(row => row.nearestAttraction),
//         distances: distances,
//         totalDistance: totalDistance
//     });
//     }
// });
// }
module.exports = {
    // CHECK
  getBusinessByCity,
  getBusinessByZipCode,
  getBusinessByAddr
};
