const { executeQuery } = require('../config/config.js');

// airline
const getAirlinesByCityName = async function(req, res) {
  const srcCity = req.query.src_city;
  const srcState = req.query.src_state;
  const dstCity = req.query.dst_city; 
  const dstState = req.query.dst_state;
  const allowTransit = req.query.allow_transit === 'true';

  let query_direct = `
      WITH flights AS (SELECT
          r.airline_ID AS airline_id,
          ar.airline AS airline_name,
          src.airport_id AS source_airport_id,
          src_air.iata_code AS source_iata_code,
          src_air.municipality AS source_city,
          src_air.local_region AS source_region,
          dest.airport_id AS destination_airport_id,
          dest_air.iata_code AS destination_iata_code,
          dest_air.municipality AS destination_city,
          dest_air.local_region AS destination_region
      FROM Routes r
         JOIN Airline ar ON ar.airline_ID = r.airline_ID
         JOIN AirportMapping src ON r.source_airport_id = src.airport_id
         JOIN Airports src_air ON src_air.iata_code = src.airport
         JOIN AirportMapping dest ON r.destination_airport_id = dest.airport_id
         JOIN Airports dest_air ON dest_air.iata_code = dest.airport
      )
    SELECT  f.airline_id, f.airline_name,
            f.source_iata_code, f.source_city,f.source_region,
            f.destination_iata_code, f.destination_city,f.destination_region
    FROM flights f
      WHERE f.source_city = ?
        AND f.destination_city = ?;
  `;
  // TODO add SORT condition

  const final_data = {};

  try {
    // add direct flight
    const directFlightData = await executeQuery(query_direct, [srcCity, dstCity]);
    final_data["direct"] = directFlightData;

    if (allowTransit) {
      let query_transit = `
      WITH flights AS (SELECT
        r.airline_ID AS airline_id,
        ar.airline AS airline_name,
        src.airport_id AS source_airport_id,
        src_air.iata_code AS source_iata_code,
        src_air.municipality AS source_city,
        src_air.local_region AS source_region,
        dest.airport_id AS destination_airport_id,
        dest_air.iata_code AS destination_iata_code,
        dest_air.municipality AS destination_city,
        dest_air.local_region AS destination_region
      FROM Routes r
             JOIN Airline ar ON ar.airline_ID = r.airline_ID
             JOIN AirportMapping src ON r.source_airport_id = src.airport_id
             JOIN Airports src_air ON src_air.iata_code = src.airport
             JOIN AirportMapping dest ON r.destination_airport_id = dest.airport_id
             JOIN Airports dest_air ON dest_air.iata_code = dest.airport
      WHERE src_air.municipality = ?
      OR dest_air.municipality = ?
      )
      SELECT
          f1.airline_id AS first_flight_airline_id,
          f1.airline_name AS first_flight_airline_name,
          f1.source_iata_code AS first_flight_source_iata_code,
          f1.source_city AS first_flight_source_city,
          f1.source_region AS first_flight_source_region,
          f1.destination_iata_code AS first_flight_destination_iata_code,
          f1.destination_city AS first_flight_destination_city,
          f1.destination_region AS first_flight_destination_region,
          f2.airline_id AS second_flight_airline_id,
          f2.airline_name AS second_flight_airline_name,
          f2.source_iata_code AS second_flight_source_iata_code,
          f2.source_city AS second_flight_source_city,
          f2.source_region AS second_flight_source_region,
          f2.destination_iata_code AS second_flight_destination_iata_code,
          f2.destination_city AS second_flight_destination_city,
          f2.destination_region AS second_flight_destination_region
      FROM (SELECT *
            FROM flights f
              WHERE f.source_city = ?
            ) f1
      JOIN flights f2 ON f1.destination_airport_id = f2.source_airport_id
        WHERE f2.destination_city = ?;
      `;

      // TODO add SORT condition
      const transitFlightData = await executeQuery(query_transit, [srcCity, dstCity, srcCity, dstCity]);
      final_data["transit"] = transitFlightData;
    }

    res.json(final_data);
  } catch (err) {
    console.error('Error in getAirlinesByCityName:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAirlinesByCityName };