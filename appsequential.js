const getWeather = require('./utils/getWeather')
console.log('Starts')
getWeather('karnajora').then(({ summary }) => {
    console.log('karnajora')
    console.log(summary)
    return getWeather('raiganj')
}).then(({ summary }) => {
    console.log('raiganj')
    console.log(summary)
})
