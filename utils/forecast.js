const request = require('request');
const forecast = (latitude, longitude, callback) => {
    var url = 'https://api.darksky.net/forecast/3e7f9d6548c2dddd4e67a80738de77da/' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) + '?units=si'
    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('unable to connect to weather services', undefined)
        } else if (response.body.error) {
            callback('unable to find the location', undefined)
        }
        else {
            callback(undefined, "It's " + response.body.daily.data[0].summary + 'The current temperature ' + response.body.currently.temperature + ' degrees Centigrade out. There is a ' + response.body.currently.precipProbability + '% chance of rain.')
        }
    })
}
module.exports = forecast