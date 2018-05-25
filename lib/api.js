const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const queryString = require('query-string');
const request = require('request');
const router = express.Router();
const config = require('./config');

app.use(bodyParser.urlencoded({extended: true}));

//TODO: ERROR HANDLING
let geocodeLocation = async (req, res) => {
  const address = req.query.address;
  const geocodeApiCall = `${config.GEOCODE_API}?key=${config.API_KEY}&address=${address}`;

  request(geocodeApiCall, (err, apiResponse, body) => {

    let locationData = JSON.parse(body);

    if(err || locationData.status !== "OK")
    {
      res.status(404).json("An error occurred geocoding the location");
    }

    else {
      res.send(locationData.results[0].geometry.location);
    }
  });
}

let getRestaurants = async (req, res) => {

  const query = getQueryString(req.query);
  const placesApiCall = `${config.PLACES_API}?${query}`;

  request(placesApiCall, (err, apiResponse, body) => {

    const restaurantData = JSON.parse(body);

    if(err || restaurantData.status !== "OK")
    {
      if (restaurantData.status === "ZERO_RESULTS")
      {
        res.json([]);
      }

      else
      {      
        res.status(404).json("An error occurred getting restaurants");
      }
    }

    else 
    {
      let restaurants = reduceRestaurantProperties(restaurantData.results);

      restaurants = restaurants.filter(r => {
        return isInRatingRange(r, req.query.minRating, req.query.maxRating)
      });

      restaurants = sortResults(restaurants, req.query.sortBy);
      res.send(restaurants);
    }
  });
}

function getQueryString(params)
{
  const keyword = (params.sortBy === 'distance' && params.keyword === undefined) ? 'restaurant' : params.keyword;

  let queryObj = { 
    key: config.API_KEY,
    location: params.latLng,
    keyword: params.keyword,
    type: 'restaurant',
    minprice: params.minPrice,
    maxprice: params.maxPrice
  }

  //When sorting by distance, radius must be omitted
  if (params.sortBy === 'distance')
  {
    queryObj.rankby = 'distance';
  }

  else
  {
    queryObj.radius = params.radius;
  }

  return queryString.stringify(queryObj);
}

function sortResults(restaurants, sortBy)
{
  const sortOptions = {
    'relevance': function(r) { return r },
    'distance': function(r) { return r },
    'priceAsc': function(r) { return r.sort((a,b) => sortByPrice(a, b)) },
    'priceDesc': function(r) { return r.sort((a, b) => sortByPrice(b, a)) },
    'ratingAsc': function(r) { return r.sort((a, b) => sortByRating(a, b)) },
    'ratingDesc': function(r) { return r.sort((a, b) => sortByRating(b, a)) }
  }

  return sortOptions[sortBy](restaurants);
}

function sortByPrice(a, b)
{
  return a.price - b.price;
}

function sortByRating(a, b)
{
  return a.rating - b.rating;
}

function isInRatingRange(restaurant, minRating, maxRating)
{
  return restaurant.rating >= minRating && restaurant.rating <= maxRating
}

function reduceRestaurantProperties(restaurantData)
{
  const propertyMap = {
    'name': 'name',
    'vicinity': 'address',
    'price_level': 'price',
    'rating': 'rating',
    'geometry': 'rawLatLng'
  }

  //Get relevant properties and remap them
  const newRestaurantData = restaurantData.map((restaurant) => {

    const reducedRestaurant = Object.keys(restaurant)
     .filter(key => Object.keys(propertyMap).includes(key))
     .reduce((data, key) => {

       data[propertyMap[key]] = key === 'geometry' ? restaurant[key].location : restaurant[key];
       return data;
     }, {});

    return reducedRestaurant;
  });

  return newRestaurantData;
}

router.get('/restaurants', getRestaurants);

router.get('/currentlocation', geocodeLocation);

router.get('/test', (req, res) => {
  res.status(200).json("API CONNECTED");
  console.log("CONNECTED");
});

module.exports = router;