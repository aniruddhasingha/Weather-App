const request = require('request')

function getGeocode(address) {
    const geocodePromise = new Promise((resolve, reject) => {
        console.log(`fetching geocode for ${address}`);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow&limit=1`;
        request({
            url,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            const data = {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            };
            resolve(data);
        })
    });
    return geocodePromise;
}

module.exports = getGeocode