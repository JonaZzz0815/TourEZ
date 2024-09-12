const express = require('express');
const cors = require('cors');
const { getDBConnection } = require('./config/config');
const hotelsApi = require('./api/hotels');
const attractionsApi = require('./api/attractions');
const locationApi = require('./api/location');
const airlinesApi = require('./api/airline');
const businessApi = require('./api/business');
const { registerUser, authenticateUser } = require('./config/user');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const newUser = req.body;
    const insertedId = await registerUser(newUser);
    res.status(201).json({ _id: insertedId });
  } catch (error) {
    if (error.code === 409) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authenticateUser({ username, password });
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/allStates', locationApi.getAllStates);
app.get('/citiesInState/:state', locationApi.getCitiesByState);
app.get('/cityScores/:city/:state', locationApi.getCityScores);
app.post('/cityArrScores/:state', locationApi.getCityArrScores);
app.post('/topKCityScoresIn/:state', locationApi.getTopKCitiesScoresInState);
app.get('/getAirlinesByCityName', airlinesApi.getAirlinesByCityName);
app.get('/getAttractionsByCity', attractionsApi.getAttractionsByCity);
app.get('/getAttractionsByZipCode', attractionsApi.getAttractionsByZipCode);
app.get('/getAttractionsByAddr', attractionsApi.getAttractionsByAddr);
app.get('/getBusinessByCity', businessApi.getBusinessByCity);
app.get('/getBusinessByZipCode', businessApi.getBusinessByZipCode); 
app.get('/getBusinessByAddr', businessApi.getBusinessByAddr);
app.get('/getHotelsByCity', hotelsApi.getHotelsByCity);
app.get('/getHotelsByZipCode', hotelsApi.getHotelsByZipCode);
app.get('/getHotelsByAddr', hotelsApi.getHotelsByAddr);
app.get('/getHotelsByNearbyBusinessQuality', hotelsApi.getHotelsByNearbyBusinessQuality);

app.listen(8050, () => {
  console.log('Server is running on port 8050');
});

module.exports = app;