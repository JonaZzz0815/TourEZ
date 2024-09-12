const {executeQuery} = require('../config/config.js');

const getZipCodeByCityName = async (req, res) => {
    const city = req.query.city;
    const state = req.query.state;

    try {
        const data = await executeQuery(`
            SELECT zip_code 
            FROM ZipCodeAddress
            WHERE city = ? AND state = ?
        `, [city, state]);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.json([]);
    }
};

const getAllStates = async (req, res) => {
    try {
        const data = await executeQuery(`
            SELECT state AS name, slogan
            FROM StateAbbr
        `);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.json([]);
    }
};

const getCitiesByState = async (req, res) => {
    const state = req.params.state;
    try {
        const data = await executeQuery(`
            SELECT DISTINCT city AS name
            FROM ZipCodeAddress
            WHERE state = ?
        `, [state]);
        res.json(data); // an array of city objects with `name` field
    } catch (err) {
        console.error(err);
        res.json([]);
    }
};

// Note: this would return a transposed data! city: {att1:val1,...}
const getCityScores = async (req, res) => {
    const city = req.params.city;
    const state = req.params.state;
    try {
        const attraction_data = await executeQuery(`
        SELECT city,COUNT(att.OBJECTID) as attraction_num
        FROM Attraction att
            JOIN AttractionHotelAddr addr ON att.OBJECTID = addr.OBJECTID
            JOIN ZipCodeAddress zip ON zip.zip_code=addr.zip_code
        WHERE zip.city = \'${city}\' and zip.state = \'${state}\';
        `)

        const business_data = await executeQuery(`
        SELECT city,COUNT(bus.business_id) as attraction_num
        FROM Businesses bus
            JOIN ZipCodeAddress zip ON zip.zip_code=bus.zip_code
        WHERE zip.city = \'${city}\' and zip.state = \'${state}\';
        `)

        const hotel_data = await executeQuery(`
        SELECT city,COUNT(h.OBJECTID) as attraction_num
        FROM Hotels h
            JOIN AttractionHotelAddr addr ON h.OBJECTID = addr.OBJECTID
            JOIN ZipCodeAddress zip ON zip.zip_code=addr.zip_code
        WHERE zip.city = \'${city}\' and zip.state = \'${state}\';
        `)
        
        // 
        const restaurant_data = await executeQuery(`
        WITH paRestaruants AS (SELECT b.business_id, city, catergories, stars
            FROM Businesses b
                JOIN BusinessCategories bc ON b.business_id = bc.business_id
                JOIN ZipCodeAddress z ON b.zip_code = z.zip_code
            WHERE catergories = 'Restaurants' AND z.city = \'${city}\' z.state = ${state},
        # PA's city, distinct_restaurants_category_count
        city_distinctRestaurantsCategoryCount AS (
            SELECT city, COUNT(DISTINCT BusinessCategories.catergories) AS distinct_restaurants_category_count
            FROM BusinessCategories
                JOIN paRestaruants ON paRestaruants.business_id = BusinessCategories.business_id
            Where z.city = \'${city}\' z.state = ${state}
            GROUP BY city
            ORDER BY COUNT(DISTINCT BusinessCategories.catergories) DESC),
        # PA cities' food category diversity score, score = num of distinct food categories/()
        city_foodDiversityScore AS (
            SELECT city,  distinct_restaurants_category_count/(SELECT AVG(distinct_restaurants_category_count) FROM city_distinctRestaurantsCategoryCount)/3 AS food_diversity_score # score is calculated as city category count/avg city category count
            FROM city_distinctRestaurantsCategoryCount
            ORDER BY food_diversity_score DESC
        ),
        -- Calculate restaurants rating score for cities in PA
        city_foodAvgStars AS (
            SELECT city, AVG(stars) as avg_restaurants_star
            FROM paRestaruants
            GROUP BY city
            ORDER BY avg_restaurants_star DESC
        ),
        city_foodStarScore AS (
            SELECT city, avg_restaurants_star/(SELECT AVG(avg_restaurants_star) FROM city_foodAvgStars) AS food_star_score # score is calculated as city avg stars/avg(city avg stars)
            FROM city_foodAvgStars
        ),
        -- Calculate total restaurants number score for cities in PA
        city_totalRestaurantsNumber AS (
            SELECT city, COUNT(distinct business_id) AS restaruants_count
            FROM paRestaruants
            GROUP BY city
        ),
        city_restaurantsNumberScore AS (
            SELECT city, restaruants_count/ (SELECT AVG(restaruants_count) FROM city_totalRestaurantsNumber) AS food_restaurant_count_score
            FROM city_totalRestaurantsNumber
            GROUP BY city
        )
        SELECT fd.city, food_restaurant_count_score+food_star_score+food_diversity_score AS city_food_score
        FROM city_foodDiversityScore fd
            JOIN city_foodStarScore fs ON fd.city = fs.city
            JOIN city_restaurantsNumberScore rn ON fs.city = rn.city
        ORDER BY city_food_score DESC;
        `, [state]);

        const cityScores = {};
        [attraction_data, business_data, hotel_data, restaurant_data].forEach(dataset => {
            dataset.forEach(item => {
                if (!cityScores[item.city]) {
                    cityScores[item.city] = {};
                }
                for (const key in item) {
                    if (key !== 'city') {
                        cityScores[item.city][key] = item[key];
                    }
                }
            });
        });
        res.json(cityScores); // an array of city objects with `name` field
    } catch (err) {
        console.error(err);
        res.json([]);
    }
};

// Note: this would return a data like att1: {city1:val1,...}, att2: {...}
const getCityArrScores = async (req, res) => {
    const cityArr = req.body.cityArr;
    const cityArrStr = cityArr.map(ele => '\''+ele+'\'').join(', ');
    const state = req.params.state;
    try {
        // TODO: opt
        const attraction_data = await executeQuery(`
        SELECT city,log(COUNT(att.OBJECTID)) as attraction_num
        FROM ZipCodeAddress zip
            Left JOIN AttractionHotelAddr addr ON zip.zip_code=addr.zip_code
            Left JOIN Attraction att ON att.OBJECTID = addr.OBJECTID
        WHERE zip.city in (${cityArrStr}) and zip.state = \'${state}\';
        `)

        const business_data = await executeQuery(`
        SELECT city,log(COUNT(bus.business_id)) as business_num
        FROM ZipCodeAddress zip
            JOIN Businesses bus ON zip.zip_code=bus.zip_code
        WHERE zip.city in (${cityArrStr}) and zip.state = \'${state}\';
        `)

        const hotel_data = await executeQuery(`
        SELECT city,log(COUNT(h.OBJECTID)) as hotel_num
        FROM ZipCodeAddress zip
            left JOIN AttractionHotelAddr addr ON zip.zip_code = addr.zip_code
            left JOIN Hotels h ON h.OBJECTID = addr.OBJECTID 
        WHERE zip.city in (${cityArrStr}) and zip.state = \'${state}\';
        `)
        
        // 
        const restaurant_data = await executeQuery(`
        WITH paRestaruants AS (SELECT b.business_id, city, catergories, stars
            FROM Businesses b
                JOIN BusinessCategories bc ON b.business_id = bc.business_id
                JOIN ZipCodeAddress z ON b.zip_code = z.zip_code
            WHERE catergories = 'Restaurants' AND z.city in (${cityArrStr}) and z.state = \'${state}\'),
        # PA's city, distinct_restaurants_category_count
        city_distinctRestaurantsCategoryCount AS (
            SELECT city, COUNT(DISTINCT BusinessCategories.catergories) AS distinct_restaurants_category_count
            FROM BusinessCategories
                JOIN paRestaruants ON paRestaruants.business_id = BusinessCategories.business_id
            Where city in (${cityArrStr})
            GROUP BY city
            ORDER BY COUNT(DISTINCT BusinessCategories.catergories) DESC),
        # PA cities' food category diversity score, score = num of distinct food categories/()
        city_foodDiversityScore AS (
            SELECT city,  distinct_restaurants_category_count/(SELECT AVG(distinct_restaurants_category_count) FROM city_distinctRestaurantsCategoryCount)/3 AS food_diversity_score # score is calculated as city category count/avg city category count
            FROM city_distinctRestaurantsCategoryCount
            Where city in (${cityArrStr})
            ORDER BY food_diversity_score DESC
        ),
        -- Calculate restaurants rating score for cities in PA
        city_foodAvgStars AS (
            SELECT city, AVG(stars) as avg_restaurants_star
            FROM paRestaruants
            Where city in (${cityArrStr})
            GROUP BY city
            ORDER BY avg_restaurants_star DESC
        ),
        city_foodStarScore AS (
            SELECT city, avg_restaurants_star/(SELECT AVG(avg_restaurants_star) FROM city_foodAvgStars) AS food_star_score # score is calculated as city avg stars/avg(city avg stars)
            FROM city_foodAvgStars
            Where city in (${cityArrStr})
        ),
        -- Calculate total restaurants number score for cities in PA
        city_totalRestaurantsNumber AS (
            SELECT city, COUNT(distinct business_id) AS restaruants_count
            FROM paRestaruants
            GROUP BY city
        ),
        city_restaurantsNumberScore AS (
            SELECT city, restaruants_count/ (SELECT AVG(restaruants_count) FROM city_totalRestaurantsNumber) AS food_restaurant_count_score
            FROM city_totalRestaurantsNumber
            GROUP BY city
        )
        SELECT fd.city, food_restaurant_count_score+food_star_score+food_diversity_score AS city_food_score
        FROM city_foodDiversityScore fd
            JOIN city_foodStarScore fs ON fd.city = fs.city
            JOIN city_restaurantsNumberScore rn ON fs.city = rn.city
        ORDER BY city_food_score DESC;
        `, [state]);

        const processResults = (dict,data, metric) => {
            cityArr.forEach(city => {
                const found = data.find(item => item.city === city);
                dict[city] = (found && found[metric]) ? Math.round(found[metric] * 100)/100 : 0.2;
            });
            return dict;
        };


        const attraction_dict = {dimension: "attractions"};
        const entertainments_dict = {dimension: "entertainments"};
        const hotels_dict = {dimension: "hotels"};
        const rest_dict = {dimension: "restaurant"};

        const max_score = {};

        const result = [
                processResults(attraction_dict,attraction_data, 'attraction_num'),
                processResults(entertainments_dict,business_data, 'business_num'),
                processResults(hotels_dict,hotel_data, 'hotel_num'),
                processResults(rest_dict,restaurant_data, 'city_food_score')
            ];
        cityArr.forEach(city =>
            {
                let maxValue = 0;
                result.forEach(dict => {
                    if (dict[city] !== undefined && dict[city] > maxValue) {
                        maxValue = dict[city];
                    }
                });
                max_score[city] = maxValue;
            }
        )
        result.forEach(dict =>
            {   
                cityArr.forEach(
                    city =>
                    {
                        if( dict[city] <= 0.2 && max_score[city] > 0.2)
                            dict[city] = Math.round((max_score[city]*0.2) * 100)/100;
                    }
                )
            }
        )
        
        console.log(result)
        res.json(result); // an array of city objects with `name` field
    } catch (err) {
        console.error(err);
        res.json([]);
    }
};

const getTopKCitiesScoresInState = async (req, res) => {
    const top_num = req.body.topK;
    const state = req.params.state;
    try {
        const attraction_data = await executeQuery(`
        SELECT city,COUNT(att.OBJECTID) as attraction_num
        FROM ZipCodeAddress zip
            LEFT JOIN AttractionHotelAddr addr ON zip.zip_code=addr.zip_code
            LEFT JOIN Attraction att ON att.OBJECTID = addr.OBJECTID
        WHERE zip.state = \'${state}\'
        Group by city;
        `)

        const business_data = await executeQuery(`
        SELECT city,COUNT(bus.business_id) as business_num
        FROM Businesses bus
            JOIN ZipCodeAddress zip ON zip.zip_code=bus.zip_code
        WHERE zip.state = \'${state}\'
        Group by city;
        `)

        const hotel_data = await executeQuery(`
        SELECT city,COUNT(h.OBJECTID) as hotel_num
        FROM Hotels h
            JOIN AttractionHotelAddr addr ON h.OBJECTID = addr.OBJECTID
            JOIN ZipCodeAddress zip ON zip.zip_code=addr.zip_code
        WHERE zip.state = \'${state}\'
        Group by city;
        `)
        
        const restaurant_data = await executeQuery(`
        WITH paRestaruants AS (SELECT b.business_id, city, catergories, stars
            FROM Businesses b
                JOIN BusinessCategories bc ON b.business_id = bc.business_id
                JOIN ZipCodeAddress z ON b.zip_code = z.zip_code
            WHERE catergories = 'Restaurants' AND state = \'${state}\'),
        # PA's city, distinct_restaurants_category_count
        city_distinctRestaurantsCategoryCount AS (
            SELECT city, COUNT(DISTINCT BusinessCategories.catergories) AS distinct_restaurants_category_count
            FROM BusinessCategories
                JOIN paRestaruants ON paRestaruants.business_id = BusinessCategories.business_id
            GROUP BY city
            ORDER BY COUNT(DISTINCT BusinessCategories.catergories) DESC),
        # PA cities' food category diversity score, score = num of distinct food categories/()
        city_foodDiversityScore AS (
            SELECT city,  distinct_restaurants_category_count/(SELECT AVG(distinct_restaurants_category_count) FROM city_distinctRestaurantsCategoryCount)/3 AS food_diversity_score # score is calculated as city category count/avg city category count
            FROM city_distinctRestaurantsCategoryCount
            ORDER BY food_diversity_score DESC
        ),
        -- Calculate restaurants rating score for cities in PA
        city_foodAvgStars AS (
            SELECT city, AVG(stars) as avg_restaurants_star
            FROM paRestaruants
            GROUP BY city
            ORDER BY avg_restaurants_star DESC
        ),
        city_foodStarScore AS (
            SELECT city, avg_restaurants_star/(SELECT AVG(avg_restaurants_star) FROM city_foodAvgStars) AS food_star_score # score is calculated as city avg stars/avg(city avg stars)
            FROM city_foodAvgStars
        ),
        -- Calculate total restaurants number score for cities in PA
        city_totalRestaurantsNumber AS (
            SELECT city, COUNT(distinct business_id) AS restaruants_count
            FROM paRestaruants
            GROUP BY city
        ),
        city_restaurantsNumberScore AS (
            SELECT city, restaruants_count/ (SELECT AVG(restaruants_count) FROM city_totalRestaurantsNumber) AS food_restaurant_count_score
            FROM city_totalRestaurantsNumber
            GROUP BY city
        )
        SELECT fd.city, food_restaurant_count_score+food_star_score+food_diversity_score AS city_food_score
        FROM city_foodDiversityScore fd
            JOIN city_foodStarScore fs ON fd.city = fs.city
            JOIN city_restaurantsNumberScore rn ON fs.city = rn.city
        ORDER BY city_food_score DESC;
        `, [state]);

        // a dict from city to score:
        const cityScores = {};
        console.log("query is :",`
        SELECT city,COUNT(att.OBJECTID) as attraction_num
        FROM ZipCodeAddress zip
            LEFT JOIN AttractionHotelAddr addr ON zip.zip_code=addr.zip_code
            LEFT JOIN Attraction att ON att.OBJECTID = addr.OBJECTID
        WHERE zip.state = \'${state}\'
        Group by city;
        `);
        console.log("result is:",attraction_data);

        attraction_data.forEach(
            att_item =>
            {
                if (!cityScores[att_item.city]) {
                    cityScores[att_item.city] = {};
                }
                cityScores[att_item.city]['attraction_num'] = att_item.attraction_num>0?Math.round(att_item.attraction_num*100)/100:0.9;
                if (cityScores[att_item.city]['attraction_num']>5)
                {
                    cityScores[att_item.city]['attraction_num'] = Math.round(Math.log(cityScores[att_item.city]['attraction_num'])*100)/100
                }                
            }
        );

        attraction_data.forEach(
            att_item =>
            {
                const found = business_data.find(item => item.city === att_item.city);
                if (!cityScores[att_item.city]) {
                    cityScores[att_item.city] = {};
                }
                cityScores[att_item.city]['business_num'] = found&&found['business_num']?Math.round(found['business_num']*100)/100:0.9;
                if (cityScores[att_item.city]['business_num']>5)
                {
                    cityScores[att_item.city]['business_num'] = Math.round(Math.log(cityScores[att_item.city]['business_num'])*100)/100
                } 
            }
        );

        attraction_data.forEach(
            att_item =>
            {
                const found = hotel_data.find(item => item.city === att_item.city);
                if (!cityScores[att_item.city]) {
                    cityScores[att_item.city] = {};
                }
                cityScores[att_item.city]['hotel_num'] = found&&found['hotel_num']?Math.round(found['hotel_num']*100)/100:0.9;
                if (cityScores[att_item.city]['hotel_num']>5)
                {
                    cityScores[att_item.city]['hotel_num'] = Math.round(Math.log(cityScores[att_item.city]['hotel_num'])*100)/100
                } 
            }
        );

        attraction_data.forEach(
            att_item =>
            {
                const found = restaurant_data.find(item => item.city === att_item.city);
                if (!cityScores[att_item.city]) {
                    cityScores[att_item.city] = {};
                }
                cityScores[att_item.city]['city_food_score'] = found&&found['city_food_score']?Math.round(found['city_food_score']*100)/100:0.9;
                if (cityScores[att_item.city]['city_food_score']>8)
                {
                    cityScores[att_item.city]['city_food_score'] = Math.round(Math.log(cityScores[att_item.city]['city_food_score'])*100)/100
                }
            }
        );

        console.log(cityScores);

        // 
        const sortedCities = Object.keys(cityScores)
            .map(city => ({
                city,
                ...cityScores[city],
                average_score: Object.values(cityScores[city]).reduce((a, b) => a + b, 0) / 4
            }))
            .sort((a, b) => b.average_score - a.average_score)
            .slice(0, top_num);

        const result = {
            data: [
                { dimension: "attractions", ...Object.fromEntries(sortedCities.map(item => [item.city, item.attraction_num])) },
                { dimension: "entertainments", ...Object.fromEntries(sortedCities.map(item => [item.city, item.business_num])) },
                { dimension: "hotels", ...Object.fromEntries(sortedCities.map(item => [item.city, item.hotel_num])) },
                { dimension: "restaurant", ...Object.fromEntries(sortedCities.map(item => [item.city, item.city_food_score])) }
            ]
        };
        res.json(result); // an array of city objects with `name` field
    } catch (err) {
        console.error(err);
        res.json([]);
    }
};

module.exports = { 
    getZipCodeByCityName,
    getAllStates,
    getCitiesByState,
    getCityScores,
    getCityArrScores,
    getTopKCitiesScoresInState
};
