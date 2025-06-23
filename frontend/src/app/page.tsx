'use client'; // Required for components with interactivity (useState, useEffect, event handlers)

import { useState, FormEvent } from 'react';

// Define interfaces for the data we expect from our API routes
interface GeocodeData {
  latitude: number;
  longitude: number;
  location: string;
}

interface WeatherData {
  location: string;
  description: string;
  temperature: number | string; // Can be string like "Not available"
  chanceOfRain: string;
}

export default function HomePage() {
  const [address, setAddress] = useState<string>('');
  const [geocodeData, setGeocodeData] = useState<GeocodeData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeocodeData(null);
    setWeatherData(null);

    if (!address.trim()) {
      setError('Address cannot be empty.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Geocode the address
      const geocodeResponse = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      if (!geocodeResponse.ok) {
        const errorData = await geocodeResponse.json();
        throw new Error(errorData.error || `Geocoding failed with status: ${geocodeResponse.status}`);
      }
      const geoData: GeocodeData = await geocodeResponse.json();
      setGeocodeData(geoData);

      // 2. Fetch weather for the coordinates
      const weatherResponse = await fetch(
        `/api/weather?latitude=${geoData.latitude}&longitude=${geoData.longitude}`
      );
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.error || `Fetching weather failed with status: ${weatherResponse.status}`);
      }
      const weatherInfo: WeatherData = await weatherResponse.json();
      setWeatherData(weatherInfo);

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-r from-sky-400 to-blue-500 text-white">
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Weather App</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Address or City:
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., New York, USA"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? 'Searching...' : 'Get Weather'}
          </button>
        </form>

        {isLoading && (
          <div className="text-center mt-6">
            <p className="text-lg font-semibold text-gray-700">Loading weather data...</p>
            {/* You can add a spinner here */}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {weatherData && !isLoading && !error && (
          <div className="mt-8 p-6 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg text-gray-800 space-y-3">
            <h2 className="text-2xl font-semibold mb-3">Current Weather for: <span className="text-blue-700">{weatherData.location}</span></h2>
            <p className="text-lg"><strong className="font-medium">Temperature:</strong> {weatherData.temperature}°C</p>
            <p className="text-lg"><strong className="font-medium">Conditions:</strong> {weatherData.description}</p>
            <p className="text-lg"><strong className="font-medium">Rain:</strong> {weatherData.chanceOfRain}</p>
          </div>
        )}

        {/* Debugging geocodeData - can be removed later */}
        {geocodeData && !isLoading && !error && (
           <div className="mt-4 p-3 bg-gray-700/20 rounded-md text-xs">
             <p>Geocoded Location: {geocodeData.location}</p>
             <p>Lat: {geocodeData.latitude.toFixed(4)}, Lon: {geocodeData.longitude.toFixed(4)}</p>
           </div>
        )}
      </div>
    </main>
  );
}
