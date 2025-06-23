import { expect } from 'chai';
import sinon from 'sinon';
import axios, { AxiosStatic } from 'axios'; // Import AxiosStatic for stubbing
import forecast from '../../utils/forecast'; // Ensure path is correct

describe('forecast', () => {
    afterEach(() => {
        sinon.restore();
    });

    const mockApiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Consistent API key

    it('should return forecast data for valid coordinates', (done) => {
        const lat = 40.758896;
        const lon = -73.985130;
        const mockResponse = {
            data: { // Axios wraps response in .data
                cod: 200,
                weather: [{ description: 'clear sky', main: 'Clear' }],
                main: { temp: 25 },
            }
        };
        const expectedUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${mockApiKey}&units=metric`;
        const axiosStub = sinon.stub(axios as AxiosStatic, 'get').resolves(mockResponse);

        forecast(lat, lon, (error?: string, forecastData?: string) => {
            expect(error).to.be.undefined;
            expect(forecastData).to.equal("It's clear sky. The current temperature is 25 degrees Celsius out. Precipitation probability is not available with the current API.");
            sinon.assert.calledOnceWithExactly(axiosStub, expectedUrl);
            done();
        });
    });

    it('should return forecast data including rain info if present (rain volume)', (done) => {
        const lat = 40.758896;
        const lon = -73.985130;
        const mockResponse = {
            data: {
                cod: 200,
                weather: [{ description: 'moderate rain', main: 'Rain' }],
                main: { temp: 22 },
                rain: { '1h': 1.5 }
            }
        };
        const expectedUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${mockApiKey}&units=metric`;
        const axiosStub = sinon.stub(axios as AxiosStatic, 'get').resolves(mockResponse);

        forecast(lat, lon, (error?: string, forecastData?: string) => {
            expect(error).to.be.undefined;
            expect(forecastData).to.equal("It's moderate rain. The current temperature is 22 degrees Celsius out. Current rain volume: 1.5mm in the last hour.");
            sinon.assert.calledOnceWithExactly(axiosStub, expectedUrl);
            done();
        });
    });

    it('should return forecast data indicating chance of rain if main weather is rain but no volume', (done) => {
        const lat = 40.758896;
        const lon = -73.985130;
        const mockResponse = {
            data: {
                cod: 200,
                weather: [{ description: 'light rain', main: 'Rain' }],
                main: { temp: 23 }
            }
        };
        const expectedUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${mockApiKey}&units=metric`;
        const axiosStub = sinon.stub(axios as AxiosStatic, 'get').resolves(mockResponse);

        forecast(lat, lon, (error?: string, forecastData?: string) => {
            expect(error).to.be.undefined;
            expect(forecastData).to.equal("It's light rain. The current temperature is 23 degrees Celsius out. There is a chance of rain.");
            sinon.assert.calledOnceWithExactly(axiosStub, expectedUrl);
            done();
        });
    });

    it('should return an error for an OpenWeatherMap API error (e.g., string error code)', (done) => {
        const lat = 0;
        const lon = 0;
        const mockResponse = { // Simulating API returning an error structure within response.data
            data: {
                cod: "400",
                message: "Invalid coordinates"
            }
        };
        // Note: For OpenWeatherMap, even API errors (like bad coordinates) might come back with a 200 HTTP status,
        // but with `cod !== 200` (or `cod !== "200"`) in the response body.
        // The stub resolves because it's an API level error, not a network/HTTP error.
        const expectedUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${mockApiKey}&units=metric`;
        const axiosStub = sinon.stub(axios as AxiosStatic, 'get').resolves(mockResponse);

        forecast(lat, lon, (error?: string, forecastData?: string) => {
            expect(error).to.equal('Unable to find location: Invalid coordinates');
            expect(forecastData).to.be.undefined;
            sinon.assert.calledOnceWithExactly(axiosStub, expectedUrl);
            done();
        });
    });

    it('should return an error for a server-side API error (axios error.response)', function(done) { // Use function for this.timeout
        this.timeout(5000); // Increase timeout to 5 seconds
        const lat = 10;
        const lon = 20;
        const apiError: any = new Error("Server Error");
        apiError.response = {
            status: 503,
            data: { message: 'Service Unavailable' }
        };
        apiError.isAxiosError = true; // Make it look like an AxiosError
        const expectedUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${mockApiKey}&units=metric`;
        const axiosStub = sinon.stub(axios as AxiosStatic, 'get').rejects(apiError);

        forecast(lat, lon, (error?: string, forecastData?: string) => {
            try {
                // Adjusted expected message to match the implementation in forecast.ts
                expect(error).to.equal('Unable to connect to weather services: Server responded with status 503. Service Unavailable');
                expect(forecastData).to.be.undefined;
                sinon.assert.calledOnceWithExactly(axiosStub, expectedUrl);
                done(); // Signal success
            } catch (e: any) {
                done(e); // Signal failure
            }
        });
    });

    it('should return an error for a network issue (no response)', function(done) { // Use function for this.timeout
        this.timeout(5000); // Increase timeout to 5 seconds
        const lat = 10;
        const lon = 20;
        const networkError: any = new Error('Network problem');
        networkError.request = {};
        networkError.isAxiosError = true; // Make it look like an AxiosError
        const expectedUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${mockApiKey}&units=metric`;
        const axiosStub = sinon.stub(axios as AxiosStatic, 'get').rejects(networkError);

        forecast(lat, lon, (error?: string, forecastData?: string) => {
            try {
                expect(error).to.equal('Unable to connect to weather services: No response received from server.');
                expect(forecastData).to.be.undefined;
                sinon.assert.calledOnceWithExactly(axiosStub, expectedUrl);
                done(); // Signal success
            } catch (e: any) {
                done(e); // Signal failure
            }
        });
    });
});
