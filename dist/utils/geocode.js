"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const geocode = async (address, callback) => {
    const accessToken = 'pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}&limit=1`;
    try {
        const response = await axios_1.default.get(url);
        const data = response.data;
        if (data.features && data.features.length === 0) {
            callback('Unable to find the location. Try another search.', undefined);
        }
        else if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            callback(undefined, {
                latitude: feature.center[1], // Corrected: Mapbox is [lon, lat]
                longitude: feature.center[0], // Corrected: Mapbox is [lon, lat]
                location: feature.place_name
            });
        }
        else {
            callback('Received an unexpected response from location services.', undefined);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                let errorMsg = `Unable to connect to location services: Server responded with status ${error.response.status}.`;
                if (error.response.data && error.response.data.message) {
                    errorMsg += ` Message: ${error.response.data.message}`;
                }
                else if (error.response.data) {
                    // Fallback if message is not directly available but data is
                    errorMsg += ` Data: ${JSON.stringify(error.response.data)}`;
                }
                callback(errorMsg, undefined);
            }
            else if (error.request) {
                callback('Unable to connect to location services: No response received from server.', undefined);
            }
            else {
                callback(`Unable to connect to location services: Error setting up request - ${error.message}`, undefined);
            }
        }
        else {
            // Non-Axios error
            callback(`An unexpected error occurred: ${error.message ? error.message : 'Unknown error'}`, undefined);
        }
    }
};
exports.default = geocode;
