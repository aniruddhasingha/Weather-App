import axios from 'axios';

// Interfaces for OpenWeatherMap API response
interface WeatherCondition {
    description: string;
    main: string;
}

interface MainWeatherData {
    temp: number;
}

interface RainData {
    '1h'?: number; // Rain volume for the last 1 hour (optional)
}

interface OpenWeatherMapResponse {
    cod: number | string; // Can be number (200) or string ("400", "404")
    message?: string; // Error message
    weather: WeatherCondition[];
    main: MainWeatherData;
    rain?: RainData;
}

// Type for the callback function
export type ForecastCallback = (error?: string, data?: string) => void;

const forecast = async (latitude: number, longitude: number, callback: ForecastCallback): Promise<void> => {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Keep placeholder
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get<OpenWeatherMapResponse>(url);
        const data = response.data;

        // Check for API errors (OpenWeatherMap uses cod for this, sometimes it's a string)
        if (data.cod && String(data.cod) !== '200') {
            callback(`Unable to find location: ${data.message || `Error code ${data.cod}`}`, undefined);
        } else if (!data.weather || data.weather.length === 0) {
            callback('Received an unexpected or incomplete response from weather services.', undefined);
        }
        else {
            const temperature = data.main.temp;
            const weatherDescription = data.weather[0].description;
            let rainInfo = "Precipitation probability is not available with the current API.";

            if (data.rain && data.rain['1h']) {
                rainInfo = `Current rain volume: ${data.rain['1h']}mm in the last hour.`;
            } else if (data.weather[0].main.toLowerCase().includes('rain')) {
                rainInfo = "There is a chance of rain.";
            }

            callback(undefined, `It's ${weatherDescription}. The current temperature is ${temperature} degrees Celsius out. ${rainInfo}`);
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                let errorMsg = `Unable to connect to weather services: Server responded with status ${error.response.status}.`;
                 if (error.response.data && error.response.data.message) {
                    errorMsg += ` ${error.response.data.message}`;
                } else if (error.response.data) {
                    errorMsg += ` Data: ${JSON.stringify(error.response.data)}`;
                }
                callback(errorMsg, undefined);
            } else if (error.request) {
                callback('Unable to connect to weather services: No response received from server.', undefined);
            } else {
                callback(`Unable to connect to weather services: Error setting up request - ${error.message}`, undefined);
            }
        } else {
            callback(`An unexpected error occurred: ${error.message ? error.message : 'Unknown error'}`, undefined);
        }
    }
};

export default forecast;