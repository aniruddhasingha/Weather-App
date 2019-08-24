const request = require('request')
const geocode = require('./geocode.js')
const forecast = require('./forecast.js')

function getWeather(location, cb) {
    geocode(location, (error, data) => {

        forecast(data.latitude, data.longitude, (error, forecast) => {
            if (cb) {
                cb(forecast, data)
            }
        })
    })
}
module.exports = getWeather