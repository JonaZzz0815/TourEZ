const {getDBConnection, executeQuery} = require('../config/config.js');

// const connection = getDBConnection();

const getHotelsByCity = async function(req, res) {
    const city = req.query.city;
    const state = req.query.state;
   //TODO: add h.score column - DONE
   // CHECK if the query works
    try{
      const query = `
      SELECT h.*,
             ah.longitude, ah.latitude,
             ah.street, ah.zip_code
      from AttractionHotelAddr ah
      join ZipCodeAddress z on z.zip_code = ah.zip_code and 
      z.city = ? and z.state = ?
      JOIN Hotels h on ah.OBJECTID = h.OBJECTID
      ORDER BY h.score DESC
     `;
     const data = await executeQuery(query,[city, state]);
     res.json(data);

    } catch (err) {
      console.error('Error in getHotelsByCity:', err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  const getHotelsByZipCode = async function(req, res) {
    const zipCode = req.query.zip_code;

    try {
      const query = `
      Select h.*,
              ah.longitude, ah.latitude,
              ah.street, ah.zip_code
      from AttractionHotelAddr ah
      JOIN Hotels h on h.OBJECTID = ah.OBJECTID
      WHERE ah.zip_code = ?
      `;
      const data = await executeQuery(query,[zipCode]);
      res.json(data);

    } catch(err) {

      console.error('Error in getHotelsByZipCode:', err);
      res.status(500).json({ error: "Internal Server Error" });
    }
    
  }
  
  const getHotelsByAddr = async function(req, res) {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const filterDistance = req.query.distance ?? 5;
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
  

    try {
      const query = `
      SELECT ah.OBJECTID, h.information, h.description, h.phone
        ST_Distance_Sphere(POINT(?, ?), POINT(ah.longitude, ah.latitude))/1000 AS distance
      FROM Hotels h
        JOIN AttractionHotelAddr ah ON ah.OBJECTID = h.OBJECTID
      HAVING distance < ?
      ORDER BY distance
      `;
      const data = await executeQuery(query, [longitude, latitude, filterDistance]);
      res.json(data);
    } catch (err) {
      console.error('Error in getHotelsByAddr:', err);
      res.status(500).json({ error: "Internal Server Error" });
    }

    
  }
  // TODO: Finish this function, possible tips: how to combine with business quality
  const getHotelsByNearbyBusinessQuality = async function(req, res) {
    const city = req.query.city;
    const state = req.query.state;
    if (!city || !state) {
      throw new Error('City and state are required');
    }
    // filter conditions

    // TODO unified the input form for businessCategory, one category or multiple categories
    console.log(req.query.businessCategories);
    var businessCategory  = req.query.businessCategories?? 'Restaurants' ;
    if (Array.isArray(businessCategory)) {
      businessCategory = businessCategory.join(', ');
    }
    const distanceRange = req.query.distanceRange ?? 2;
    const ratingCriteria = req.query.ratingCriteria ?? 0;
    // sort conditions
    const sortByRating = req.query.sortByRating ?? false;
    const sortByNum = req.query.sortByNum ?? false;


    // process the order by conditions
    // CHECK if the query works in front end
    order_conditions = '';
    if (sortByRating) {
      order_conditions += 'ORDER BY avg_rating DESC';
    }
    if (sortByNum) {
      if (sortByRating) order_conditions += ', num_businesses DESC';
      else order_conditions += 'ORDER BY num_businesses DESC';
    }


    // TODO: what else col need to return?
    try{
      const query = `
      WITH NearbyRestaurants AS (
        SELECT
            h.OBJECTID,
            h.name,
            haddr.street,
            haddr.zip_code,
            zip.city, zip.state,
            AVG(bus.stars) OVER (PARTITION BY h.OBJECTID) AS avg_rating,
            COUNT(*) OVER (PARTITION BY h.OBJECTID) AS num_businesses
        FROM
            Hotels h
            JOIN AttractionHotelAddr haddr ON haddr.OBJECTID = h.OBJECTID
            JOIN ZipCodeAddress zip ON zip.zip_code = haddr.zip_code
            JOIN Businesses bus ON bus.zip_code = haddr.zip_code
            JOIN BusinessCategories bc ON bus.business_id = bc.business_id
        WHERE
             bc.catergories in (?) 
             AND ST_Distance_Sphere(POINT(haddr.longitude, haddr.latitude), POINT(bus.longitude, bus.latitude)) / 1000.0 <= ?
                AND bus.stars > ?
                  AND zip.city = ?
                  AND zip.state = ?
      )
      SELECT
          DISTINCT *
      FROM
          NearbyRestaurants nr
      ` + order_conditions;
      console.log(businessCategory);
      console.log(distanceRange);
      const data = await executeQuery(query,[businessCategory, distanceRange, ratingCriteria, city, state]);
      res.json(data);
      console.log(data.length);
    } catch (err) {
      
      console.error('Error in getHotelsByNearbyBusinessQuality:', err);
      res.status(500).json({ error: "Internal Server Error" });
    }
    

  }
module.exports = {
  getHotelsByCity, // unfinished
  getHotelsByZipCode,
  getHotelsByAddr,
  getHotelsByNearbyBusinessQuality // need check
};
