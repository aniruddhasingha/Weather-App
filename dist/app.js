"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geocode_1 = __importDefault(require("./utils/geocode")); // Removed unused Callback types
const forecast_1 = __importDefault(require("./utils/forecast")); // Removed unused Callback types
const address = process.argv[2];
if (!address) {
    console.log('Please provide an address.');
}
else {
    (0, geocode_1.default)(address, (error, data) => {
        if (error) {
            return console.log('Geocode Error:', error);
        }
        if (data) {
            console.log('Location:', data.location);
            (0, forecast_1.default)(data.latitude, data.longitude, (error, forecastData) => {
                if (error) {
                    return console.log('Forecast Error:', error);
                }
                if (forecastData) {
                    console.log('Forecast:', forecastData);
                }
                else {
                    console.log('Forecast data is undefined without an error.');
                }
            });
        }
        else {
            console.log('Geocode data is undefined without an error.');
        }
    });
}
// console.time // This was commented out in original, keeping it that way.
