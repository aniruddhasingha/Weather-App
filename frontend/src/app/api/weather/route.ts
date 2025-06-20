import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Interfaces based on OpenWeatherMap's Current Weather API response
interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

interface MainWeatherData {
  temp: number; // Temperature
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface WindData {
  speed: number;
  deg: number;
}

interface RainData {
  '1h'?: number; // Rain volume for the last 1 hour in mm
}

interface SnowData {
  '1h'?: number; // Snow volume for the last 1 hour in mm
}

interface CloudsData {
  all: number; // Cloudiness, %
}

interface SysData {
  type?: number;
  id?: number;
  country?: string;
  sunrise?: number; // Sunrise time, unix, UTC
  sunset?: number;  // Sunset time, unix, UTC
}

interface OpenWeatherMapResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility?: number;
  wind?: WindData;
  rain?: RainData;
  snow?: SnowData;
  clouds?: CloudsData;
  dt?: number; // Time of data calculation, unix, UTC
  sys?: SysData;
  timezone?: number; // Shift in seconds from UTC
  id?: number; // City ID
  name?: string; // City name
  cod: number | string; // Internal parameter, use string for flexibility
  message?: string; // For error messages
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Latitude and longitude query parameters are required' }, { status: 400 });
  }

  const openWeatherMapApiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  if (!openWeatherMapApiKey) {
    console.error('OpenWeatherMap API key is not configured.');
    return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=metric`;

  try {
    const response = await axios.get<OpenWeatherMapResponse>(url);

    if (response.data && String(response.data.cod) === '200') { // Ensure cod is compared as string or number consistently
      const { weather, main, rain, name } = response.data;
      const weatherData = {
        location: name || 'Unknown location',
        description: weather && weather.length > 0 ? weather[0].description : 'Not available',
        temperature: main ? main.temp : 'Not available', // main should exist if cod is 200
        chanceOfRain: rain && rain['1h'] ? `${rain['1h']}mm in the last hour` : 'No significant rain reported',
        // You can expand this with more data from the OpenWeatherMapResponse
      };
      return NextResponse.json(weatherData);
    } else {
      // Handle cases where API returns a non-200 but not an axios error (e.g. bad API key, invalid city)
      const errorMessage = response.data.message || 'Error fetching weather data';
      const statusCode = typeof response.data.cod === 'string' ? parseInt(response.data.cod, 10) : response.data.cod;
      console.error('OpenWeatherMap API non-200 response:', errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: statusCode || 500 });
    }
  } catch (error) {
    console.error('Weather API error:', error);
    if (axios.isAxiosError(error) && error.response) {
        return NextResponse.json({ error: 'Error fetching weather data', details: error.response.data?.message || error.message }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Error fetching weather data' }, { status: 500 });
  }
}
