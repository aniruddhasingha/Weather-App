const getGeocode = require('./geocode.js')
const getForecast = require('./forecast.js')

function getWeather(location) {
  const weatherPromise = new Promise((resolve, reject) => {
    getGeocode(location)
      .then(({ latitude, longitude, location }) => {
        return getForecast(longitude, latitude)
      })
      .then((summary) => {
        resolve(summary);
      })
      .catch((e) => {
        reject(e);
      })
  })
  return weatherPromise;
}

module.exports = getWeather