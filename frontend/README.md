# Weather App Frontend (Next.js)

This is a Next.js application that provides a user interface to search for weather conditions by address. It uses Mapbox for geocoding and OpenWeatherMap for weather data.

## Prerequisites

*   Node.js (version 18.x or later recommended, as used by Next.js 13+/14+)
*   npm or yarn

## Setup

1.  **Clone the Repository (if you haven't already):**
    ```bash
    # If this frontend is part of a larger repository, ensure the whole repo is cloned.
    # git clone <repository_url>
    # cd <repository_name>/frontend
    ```

2.  **Install Dependencies:**
    Navigate to the `frontend` directory if you're not already there, then run:
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set Up Environment Variables:**
    *   In the `frontend` directory, create a file named `.env.local`.
    *   Add the following content to it:
        ```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="YOUR_MAPBOX_ACCESS_TOKEN_HERE"
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY="YOUR_OPENWEATHERMAP_API_KEY_HERE"
        ```
    *   **Important:** Replace the placeholder values with your actual API keys:
        *   **Mapbox:** Sign up/log in at [https://www.mapbox.com/](https://www.mapbox.com/) to get an access token (your default public token should work).
        *   **OpenWeatherMap:** Sign up/log in at [https://openweathermap.org/api](https://openweathermap.org/api) and get an API key for the "Current Weather Data" service.
    *   (Note: In a previous step, we already created `.env.local` with more detailed comments. This README section provides the essential variables needed.)

## Running the Development Server

After setting up the environment variables, you can run the development server:

```bash
npm run dev
# or
# yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Key Features

*   Address input for weather search.
*   Geocoding via Mapbox API (through a Next.js API route).
*   Weather data fetching via OpenWeatherMap API (through a Next.js API route).
*   Responsive UI built with Next.js App Router and Tailwind CSS.

## API Routes

This application uses internal API routes to securely handle requests to external services:

*   `GET /api/geocode?address=<address>`: Fetches geocoding data.
*   `GET /api/weather?latitude=<lat>&longitude=<lon>`: Fetches weather data.
```
