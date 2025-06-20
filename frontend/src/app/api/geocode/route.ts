import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface MapboxFeature {
  place_name: string;
  center: [number, number]; // [longitude, latitude]
}

interface MapboxResponse {
  features: MapboxFeature[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address query parameter is required' }, { status: 400 });
  }

  const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!mapboxApiKey) {
    console.error('Mapbox API key is not configured.');
    return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${mapboxApiKey}&limit=1`;

  try {
    const response = await axios.get<MapboxResponse>(url);

    if (response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      const geocodeData = {
        latitude: feature.center[1],
        longitude: feature.center[0],
        location: feature.place_name,
      };
      return NextResponse.json(geocodeData);
    } else {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Geocoding API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: 'Error fetching geocoding data', details: error.response.data }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Error fetching geocoding data' }, { status: 500 });
  }
}
