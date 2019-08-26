const request = require('request')
// const geocode = (address, callback) => {
//     const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow&limit=1'
//     request({ url: url, json: true }, (error, response) => {
//         if (error) {
//             callback('unable to connect to location services', undefined)
//         }
//         else if (response.body.features.length === 0) {
//             callback('unable to find the location.Try another search', undefined)
//         }
//         else {
//             const data = {
//                 latitude: response.body.features[0].center[1],
//                 longitude: response.body.features[0].center[0],
//                 location: response.body.features[0].place_name
//             }
//             callback(undefined, data)
//         }

//     })
// }

// module.exports = geocode
const promise1 = new Promise((resolve, reject) => {
    let address = "kolkata"
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow&limit=1'
    request({ url: url, json: true }, (error, response) => {
        const data = {
            latitude: response.body.features[0].center[1],
            longitude: response.body.features[0].center[0],
            location: response.body.features[0].place_name
        }
        resolve(data)
    })
})

promise1
    .then(info => {
        console.log(info.location)
        console.log("lat = " + info.latitude)
        console.log("long =" + info.longitude)
    })
