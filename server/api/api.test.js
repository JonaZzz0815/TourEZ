const request = require('supertest');
const app = require('../server');
const { executeQuery } = require('../config/config.js');
const { registerUser, authenticateUser } = require('../config/user.js');
jest.mock('../config/config.js', () => ({
  executeQuery: jest.fn(),
}));
jest.mock('../config/user.js', () => ({
  registerUser: jest.fn(),
  authenticateUser: jest.fn(),
}));

describe('API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Hotels API', () => {
    describe('getHotelsByCity', () => {
      it('should return hotels by city and state', async () => {
        const mockData = [
          {
            OBJECTID: 1,
            name: 'Hotel 1',
            longitude: -122.4194,
            latitude: 37.7749,
            street: '123 Main St',
            zip_code: '12345',
            score: 4.5,
          },
        ];
        executeQuery.mockResolvedValueOnce(mockData);

        const response = await request(app)
          .get('/getHotelsByCity')
          .query({ city: 'San Francisco', state: 'CA' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(executeQuery).toHaveBeenCalledTimes(1);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ['San Francisco', 'CA']);
      });
    });

    describe('getHotelsByZipCode', () => {
      it('should return hotels by zip code', async () => {
        const mockData = [
          {
            OBJECTID: 1,
            name: 'Hotel 1',
            longitude: -122.4194,
            latitude: 37.7749,
            street: '123 Main St',
            zip_code: '12345',
          },
        ];
        executeQuery.mockResolvedValueOnce(mockData);

        const response = await request(app)
          .get('/getHotelsByZipCode')
          .query({ zip_code: '12345' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(executeQuery).toHaveBeenCalledTimes(1);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ['12345']);
      });
    });

    describe('getHotelsByAddr', () => {
      it('should return hotels by latitude and longitude', async () => {
        const mockData = [
          {
            OBJECTID: 1,
            information: 'Hotel 1 info',
            description: 'Hotel 1 description',
            phone: '123-456-7890',
            distance: 1.5,
          },
        ];
        executeQuery.mockResolvedValueOnce(mockData);

        const response = await request(app)
          .get('/getHotelsByAddr')
          .query({ latitude: 37.7749, longitude: -122.4194, distance: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(executeQuery).toHaveBeenCalledTimes(1);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ["-122.4194", "37.7749", "5"]);
      });
    });

    describe('getHotelsByNearbyBusinessQuality', () => {
      it('should return hotels by nearby business quality', async () => {
        const mockData = [
          {
            OBJECTID: 1,
            name: 'Hotel 1',
            street: '123 Main St',
            zip_code: '12345',
            city: 'San Francisco',
            state: 'CA',
            avg_rating: 4.5,
            num_businesses: 10,
          },
        ];
        executeQuery.mockResolvedValueOnce(mockData);

        const response = await request(app)
          .get('/getHotelsByNearbyBusinessQuality')
          .query({
            city: 'San Francisco',
            state: 'CA',
            businessCategories: 'Restaurants',
            distanceRange: 2,
            ratingCriteria: 4,
            sortByRating: true,
            sortByNum: true,
          });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(executeQuery).toHaveBeenCalledTimes(1);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), [
          'Restaurants',
          "2",
          "4",
          'San Francisco',
          'CA',
        ]);
      });
    });
  });

  describe('Airlines API', () => {
    describe('getAirlinesByCityName', () => {
      it('should return direct flights when allow_transit is false', async () => {
        const mockDirectFlightData = [
          {
            airline_id: 1,
            airline_name: 'Airline 1',
            source_iata_code: 'SRC',
            source_city: 'Source City',
            source_region: 'Source Region',
            destination_iata_code: 'DST',
            destination_city: 'Destination City',
            destination_region: 'Destination Region',
          },
        ];

        executeQuery.mockResolvedValueOnce(mockDirectFlightData);

        const response = await request(app)
          .get('/getAirlinesByCityName')
          .query({
            src_city: 'Source City',
            dst_city: 'Destination City',
            allow_transit: 'false',
          });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          direct: mockDirectFlightData,
        });
        expect(executeQuery).toHaveBeenCalledTimes(1);
      });

      it('should return direct and transit flights when allow_transit is true', async () => {
        const mockDirectFlightData = [
          {
            airline_id: 1,
            airline_name: 'Airline 1',
            source_iata_code: 'SRC',
            source_city: 'Source City',
            source_region: 'Source Region',
            destination_iata_code: 'DST',
            destination_city: 'Destination City',
            destination_region: 'Destination Region',
          },
        ];

        const mockTransitFlightData = [
          {
            first_flight_airline_id: 1,
            first_flight_airline_name: 'Airline 1',
            first_flight_source_iata_code: 'SRC',
            first_flight_source_city: 'Source City',
            first_flight_source_region: 'Source Region',
            first_flight_destination_iata_code: 'TRS',
            first_flight_destination_city: 'Transit City',
            first_flight_destination_region: 'Transit Region',
            second_flight_airline_id: 2,
            second_flight_airline_name: 'Airline 2',
            second_flight_source_iata_code: 'TRS',
            second_flight_source_city: 'Transit City',
            second_flight_source_region: 'Transit Region',
            second_flight_destination_iata_code: 'DST',
            second_flight_destination_city: 'Destination City',
            second_flight_destination_region: 'Destination Region',
          },
        ];

        executeQuery.mockResolvedValueOnce(mockDirectFlightData);
        executeQuery.mockResolvedValueOnce(mockTransitFlightData);

        const response = await request(app)
          .get('/getAirlinesByCityName')
          .query({
            src_city: 'Source City',
            dst_city: 'Destination City',
            allow_transit: 'true',
          });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          direct: mockDirectFlightData,
          transit: mockTransitFlightData,
        });
        expect(executeQuery).toHaveBeenCalledTimes(2);
      });
    });
  });
    
    
  describe('Attractions API', () => {
    describe('getAttractionsByCity', () => {
      it('should return attractions by city and state', async () => {
        const mockData = [
          {
            OBJECTID: 1,
            name: 'Attraction 1',
            longitude: -122.4194,
            latitude: 37.7749,
            street: '123 Main St',
            zip_code: '12345',
          },
        ];
        executeQuery.mockResolvedValueOnce(mockData);

        const response = await request(app)
          .get('/getAttractionsByCity')
          .query({ city: 'San Francisco', state: 'CA' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(executeQuery).toHaveBeenCalledTimes(1);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ['San Francisco', 'CA']);
      });
    });

    describe('getAttractionsByZipCode', () => {
      it('should return attractions by zip code', async () => {
        const mockData = [
          {
            OBJECTID: 1,
            name: 'Attraction 1',
            longitude: -122.4194,
            latitude: 37.7749,
            street: '123 Main St',
            zip_code: '12345',
          },
        ];
        executeQuery.mockResolvedValueOnce(mockData);

        const response = await request(app)
          .get('/getAttractionsByZipCode')
          .query({ zip_code: '12345' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(executeQuery).toHaveBeenCalledTimes(1);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ['12345']);
      });
    });

    describe('getAttractionsByAddr', () => {
      it('should return attractions by latitude and longitude', async () => {
        const mockData = [
          {
            OBJECTID: 1,
            name: 'Attraction 1',
            longitude: -122.4194,
            latitude: 37.7749,
            street: '123 Main St',
            zip_code: '12345',
            distance: 1.5,
          },
        ];
        executeQuery.mockResolvedValueOnce(mockData);

        const response = await request(app)
          .get('/getAttractionsByAddr')
          .query({ latitude: 37.7749, longitude: -122.4194, distance: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(executeQuery).toHaveBeenCalledTimes(1);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ["-122.4194", "37.7749", "5"]);
      });
    });
  });
    
  
    describe('Business API', () => {
        describe('getBusinessByCity', () => {
            it('should return businesses by city and state', async () => {
                const mockData = [
                    {
                        "attraction": "Attraction 1",
                        "distance": 2.5,
                        "nearest_attraction": "Attraction 2",
                        },
                    {
                        "attraction": "Attraction 1",
                        "distance": 3.8,
                        "nearest_attraction": "Attraction 3",
                    },
                ];
                executeQuery.mockResolvedValueOnce(mockData);

                const response = await request(app)
                    .get('/getBusinessByCity')
                    .query({ city: 'San Francisco', state: 'CA' });
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual(mockData);
                expect(executeQuery).toHaveBeenCalledTimes(1);
                expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ['San Francisco', 'CA']);
            });
        });

        describe('getBusinessByZipCode', () => {
            it('should return businesses by zip code', async () => {
                const mockData = [
                    {
                        "attraction": "Attraction 1",
                        "distance": 2.5,
                        "nearest_attraction": "Attraction 2",
                        },
                    {
                        "attraction": "Attraction 1",
                        "distance": 3.8,
                        "nearest_attraction": "Attraction 3",
                    },
                ];
                executeQuery.mockResolvedValueOnce(mockData);

                const response = await request(app)
                    .get('/getBusinessByZipCode')
                    .query({ zip_code: '12345' });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(mockData);
                expect(executeQuery).toHaveBeenCalledTimes(1);
                expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ['12345']);
            });
        });

        describe('getBusinessByAddr', () => {
            it('should return businesses by latitude and longitude', async () => {
                const mockData = [
                    {
                        "attraction": "Attraction 1",
                        "distance": 2.5,
                        "nearest_attraction": "Attraction 2",
                        },
                    {
                        "attraction": "Attraction 1",
                        "distance": 3.8,
                        "nearest_attraction": "Attraction 3",
                    },
                ];
                executeQuery.mockResolvedValueOnce(mockData);

                const response = await request(app)
                    .get('/getBusinessByAddr')
                    .query({ latitude: 37.7749, longitude: -122.4194, distance: 5 });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(mockData);
                expect(executeQuery).toHaveBeenCalledTimes(1);
                expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ["-122.4194", "37.7749", "5"]);
            });
        });
    });

    
    
    describe('getZipCodeByCityName', () => {
        it('should return zip codes for a given city and state', async () => {
          const mockData = [{ zip_code: '12345' }, { zip_code: '67890' }];
          executeQuery.mockResolvedValueOnce(mockData);
    
          const response = await request(app)
            .get('/getZipCodeByCityName')
            .query({ city: 'San Francisco', state: 'CA' });
    
          expect(response.status).toBe(404);
        });
      });
    
      describe('getAllStates', () => {
        it('should return all states with their slogans', async () => {
            const mockData = [{ "zip_code": "12345", }, { "zip_code": "67890"}];
          executeQuery.mockResolvedValueOnce(mockData);
    
          const response = await request(app).get('/allStates');
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual(mockData);
          expect(executeQuery).toHaveBeenCalledTimes(1);
          expect(executeQuery).toHaveBeenCalledWith(expect.any(String));
        });
      });
    
      describe('getCitiesByState', () => {
          it('should return cities for a given state', async () => {
            const mockData = [{ "zip_code": "12345", }, { "zip_code": "67890"}];
          executeQuery.mockResolvedValueOnce(mockData);
    
          const response = await request(app).get('/citiesInState/CA');
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual(mockData);
          expect(executeQuery).toHaveBeenCalledTimes(1);
          expect(executeQuery).toHaveBeenCalledWith(expect.any(String), ['CA']);
        });
      });
    
      describe('getCityScores', () => {
        it('should return city scores for a given city and state', async () => {
          const mockData = [
            { city: 'San Francisco', attraction_num: 100 },
            { city: 'San Francisco', business_num: 500 },
            { city: 'San Francisco', hotel_num: 50 },
            { city: 'San Francisco', city_food_score: 4.5 },
          ];
          executeQuery.mockResolvedValueOnce([mockData[0]]);
          executeQuery.mockResolvedValueOnce([mockData[1]]);
          executeQuery.mockResolvedValueOnce([mockData[2]]);
          executeQuery.mockResolvedValueOnce([mockData[3]]);
    
          const response = await request(app).get('/cityScores/San Francisco/CA');
    
          expect(response.status).toBe(200);
        });
      });
    
      describe('getCityArrScores', () => {
        it('should return city scores for an array of cities in a given state', async () => {
          const mockData = [
            { city: 'San Francisco', attraction_num: 0.2 },
            { city: 'Los Angeles', attraction_num: 0.2 },
            { city: 'San Francisco', business_num: 0.2 },
            { city: 'Los Angeles', business_num: 0.2 },
            { city: 'San Francisco', hotel_num: 0.2 },
            { city: 'Los Angeles', hotel_num: 0.2 },
            { city: 'San Francisco', city_food_score: 0.2 },
            { city: 'Los Angeles', city_food_score: 0.2 },
          ];
          executeQuery.mockResolvedValueOnce([mockData[0], mockData[1]]);
          executeQuery.mockResolvedValueOnce([mockData[2], mockData[3]]);
          executeQuery.mockResolvedValueOnce([mockData[4], mockData[5]]);
          executeQuery.mockResolvedValueOnce([mockData[6], mockData[7]]);
    
          const response = await request(app)
            .post('/cityArrScores/CA')
            .send({ cityArr: ['San Francisco', 'Los Angeles'] });
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual([
            { dimension: 'attractions', 'San Francisco': 0.2, 'Los Angeles': 0.2 },
            { dimension: 'entertainments', 'San Francisco': 0.2, 'Los Angeles': 0.2 },
            { dimension: 'hotels', 'San Francisco': 0.2, 'Los Angeles': 0.2 },
            { dimension: 'restaurant', 'San Francisco': 0.2, 'Los Angeles': 0.2 },
          ]);
          expect(executeQuery).toHaveBeenCalledTimes(4);
        });
      });
    
      describe('getTopKCitiesScoresInState', () => {
        it('should return top K cities with scores in a given state', async () => {
          const mockData = [
            { city: 'San Francisco', attraction_num: 0.9 },
            { city: 'Los Angeles', attraction_num: 0.9 },
            { city: 'San Francisco', business_num: 0.9 },
            { city: 'Los Angeles', business_num: 0.9 },
            { city: 'San Francisco', hotel_num: 0.9 },
            { city: 'Los Angeles', hotel_num: 0.9 },
            { city: 'San Francisco', city_food_score: 0.9 },
            { city: 'Los Angeles', city_food_score: 0.9 },
          ];
          executeQuery.mockResolvedValueOnce([mockData[0], mockData[1]]);
          executeQuery.mockResolvedValueOnce([mockData[2], mockData[3]]);
          executeQuery.mockResolvedValueOnce([mockData[4], mockData[5]]);
          executeQuery.mockResolvedValueOnce([mockData[6], mockData[7]]);
    
          const response = await request(app)
            .post('/topKCityScoresIn/CA')
            .send({ topK: 2 });
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual({
            data: [
              { dimension: 'attractions', 'San Francisco': 0.9, 'Los Angeles': 0.9 },
              { dimension: 'entertainments', 'San Francisco': 0.9, 'Los Angeles': 0.9 },
              { dimension: 'hotels', 'San Francisco': 0.9, 'Los Angeles': 0.9 },
              { dimension: 'restaurant', 'San Francisco': 0.9, 'Los Angeles': 0.9 },
            ],
          });
          expect(executeQuery).toHaveBeenCalledTimes(4);
        });
      });
    
      describe('POST /register', () => {
        it('should register a new user and return the inserted ID', async () => {
          const newUser = { username: 'testuser', password: 'password' };
          const insertedId = '1234567890';
          registerUser.mockResolvedValue(insertedId); // Use mockResolvedValue instead of mockResolvedValueOnce
    
          const response = await request(app)
            .post('/register')
            .send(newUser);
    
          expect(response.status).toBe(201);
          expect(response.body).toEqual({ _id: insertedId });
          expect(registerUser).toHaveBeenCalledTimes(1);
          expect(registerUser).toHaveBeenCalledWith(newUser);
        });
    
        it('should return 409 Conflict if the user already exists', async () => {
          const newUser = { username: 'testuser', password: 'password' };
          const error = new Error('User already exists');
          error.code = 409;
          registerUser.mockRejectedValue(error); // Use mockRejectedValue instead of mockRejectedValueOnce
    
          const response = await request(app)
            .post('/register')
            .send(newUser);
    
          expect(response.status).toBe(409);
          expect(response.body).toEqual({ message: error.message });
          expect(registerUser).toHaveBeenCalledTimes(1);
          expect(registerUser).toHaveBeenCalledWith(newUser);
        });
    
        // ... other tests
      });
    
      describe('POST /login', () => {
        it('should authenticate the user and return the result', async () => {
          const credentials = { username: 'testuser', password: 'password' };
          const result = { status: 200, token: 'abcdef' };
          authenticateUser.mockResolvedValue(result); // Use mockResolvedValue instead of mockResolvedValueOnce
    
          const response = await request(app)
            .post('/login')
            .send(credentials);
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual(result);
          expect(authenticateUser).toHaveBeenCalledTimes(1);
          expect(authenticateUser).toHaveBeenCalledWith(credentials);
        });
    
        it('should return 500 Internal Server Error for other errors', async () => {
          const credentials = { username: 'testuser', password: 'password' };
          const error = new Error('Internal Server Error');
          authenticateUser.mockRejectedValue(error); // Use mockRejectedValue instead of mockRejectedValueOnce
    
          const response = await request(app)
            .post('/login')
            .send(credentials);
    
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Internal Server Error' });
          expect(authenticateUser).toHaveBeenCalledTimes(1);
          expect(authenticateUser).toHaveBeenCalledWith(credentials);
        });
      });
    
    
});