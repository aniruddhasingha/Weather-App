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
const promise = new Promise((resolve, reject) => {
    geocode("gaya bihar", (error, data) => {
        forecast(data.latitude, data.longitude, (error, forecast) => {
            resolve({ forecast, data })
        })
    })
})
promise
    .then(({ forecast, data }) => {
        console.log(forecast.summary)
        console.log(data.location)
    })