import geocode, { GeocodeData } from './utils/geocode'; // Removed unused Callback types
import forecast from './utils/forecast'; // Removed unused Callback types

const address: string | undefined = process.argv[2];

if (!address) {
    console.log('Please provide an address.');
} else {
    geocode(address, (error?: string, data?: GeocodeData) => {
        if (error) {
            return console.log('Geocode Error:', error);
        }
        if (data) {
            console.log('Location:', data.location);

            forecast(data.latitude, data.longitude, (error?: string, forecastData?: string) => {
                if (error) {
                    return console.log('Forecast Error:', error);
                }
                if (forecastData) {
                    console.log('Forecast:', forecastData);
                } else {
                    console.log('Forecast data is undefined without an error.');
                }
            });
        } else {
            console.log('Geocode data is undefined without an error.');
        }
    });
}

// console.time // This was commented out in original, keeping it that way.