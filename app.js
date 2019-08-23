const request = require('request')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')
//const address = process.argv[2]
let respCount = 0;
let limit = 10;
let a = Date.now()
for (let i = 0; i < 10; i++) {
    geocode('karnajora', (error, data) => {
        if (error) {
            return console.log(error)
        }
        forecast(data.latitude, data.longitude, (error, forecastData) => {
            if (error) {
                return console.log(error)
            }
            console.log(data.location)
            console.log(forecastData)
            respCount++
            if (respCount === limit) {
                console.log((+new Date() - +a) / 1000 + ' seconds')
            }
        })

    })
}
console.log('Starts')


//console.time