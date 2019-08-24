const request = require('request')
const getWeather = require('./utils/getWeather.js')
const input = require('./input.json')
console.time("TotalTime")
let respCount = 1;
for (let i = 0; i < input.length; i++) {
    let a = Date.now()
    getWeather(input[i], (forecast, data) => {
        console.log(forecast.summary)
        console.log(data.location)
        respCount++
        if (respCount === input.length + 1) {
            console.timeEnd("TotalTime")
        }

    })
}
console.log('starts');
