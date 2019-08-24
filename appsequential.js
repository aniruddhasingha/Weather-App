const getWeather = require('./utils/getWeather')
console.time('TotalTime')
let responseCount = 1
getWeather('karnajora', (forecast, data) => {
    getWeather('kolkata', (forecast, data) => {
        console.log(data.location)
        console.log(forecast.summary)
        console.timeEnd('TotalTime')
    })
    console.log(data.location)
    console.log(forecast.summary)
})
console.log('Starts')