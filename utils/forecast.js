const request = require('request');

function getForecast(longitude, latitude) {
    const forecastPromise = new Promise((resolve, reject) => {
        console.log(`fetching forecast for longitude: ${longitude}, latitude:${latitude}`);
        const url = `https://api.darksky.net/forecast/3e7f9d6548c2dddd4e67a80738de77da/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}?units=si`
        request({
            url,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            const summary = {
                summary: response.body.currently.summary,
                summaryBody: body.currently.summary,
            };
            resolve(summary);
        })
    });
    return forecastPromise;
}

module.exports = getForecast