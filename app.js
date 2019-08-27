const request = require('request')
const getWeather = require('./utils/getWeather.js')
const input = require('./input.json')
console.log('starts');
for (let i = 0; i < input.length; i++) {
    getWeather(input[i]).then(({ summary, summaryBody }) => {
        console.log(input[i])
        console.log(summary)
    })
    // if (respCount === input.length + 1) {
    //     console.timeEnd("TotalTime")
    // }
}



