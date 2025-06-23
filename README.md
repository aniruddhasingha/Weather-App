# Weather Data Backend CLI

This Node.js command-line application fetches geocoding information for a given address using the Mapbox API and then retrieves the current weather conditions for those coordinates using the OpenWeatherMap API. The application is written in TypeScript.

## Features

*   Converts a physical address into geographic coordinates (latitude, longitude).
*   Fetches current weather data (temperature, conditions, chance of rain) for the obtained coordinates.
*   Uses `axios` for HTTP requests.
*   Includes unit tests for utility functions (geocode, forecast) using Mocha, Chai, and Sinon.
*   Written in TypeScript and compiled to JavaScript.

## Prerequisites

*   Node.js (v20.x recommended, as specified in `package.json` engines)
*   npm (comes with Node.js)

## Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your_repository_url>
    cd <repository_name>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **API Key Configuration:**
    This application requires API keys for Mapbox and OpenWeatherMap.
    *   **OpenWeatherMap API Key:**
        *   The application expects an OpenWeatherMap API key. You need to manually replace the placeholder string `YOUR_OPENWEATHERMAP_API_KEY` in the file `utils/forecast.ts` (or `dist/utils/forecast.js` after compilation) with your actual API key.
        *   You can obtain a free API key from [OpenWeatherMap](https://openweathermap.org/api).
    *   **Mapbox Access Token:**
        *   The application uses a Mapbox access token. The one currently in `utils/geocode.ts` (or `dist/utils/geocode.js`) is a hardcoded token from the original project. For reliable usage, you should replace it with your own token from [Mapbox](https://www.mapbox.com/).

    *(Note: For a production application, API keys should ideally be managed via environment variables rather than being hardcoded or manually replaced in source files.)*

## Usage

1.  **Compile TypeScript (if you've made changes to `.ts` files):**
    ```bash
    npm run build
    ```
    This command compiles the TypeScript files (like `app.ts` and those in `utils/`) into the `dist/` directory, as configured in `tsconfig.json`.

2.  **Run the Application:**
    Provide an address as a command-line argument:
    ```bash
    node dist/app.js "New York, USA"
    ```
    Or, using the npm start script (which is configured in `package.json` to run `node dist/app.js` and correctly passes arguments):
    ```bash
    npm start -- "Paris, France"
    ```

    The application will output the location and its current weather forecast to the console.

## Running Tests

To run the unit tests for the utility functions:

```bash
npm test
```

This command uses Mocha and `ts-node` to execute tests written in TypeScript located in the `tests/` directory, as configured in `package.json`.

## Project Structure (Backend)

*   `app.ts`: Main application entry point (CLI logic).
*   `utils/`: Contains utility modules.
    *   `geocode.ts`: Handles geocoding requests to Mapbox.
    *   `forecast.ts`: Handles weather data requests to OpenWeatherMap.
*   `tests/`: Contains unit tests for the backend.
*   `package.json`: Defines project dependencies, scripts (like `build`, `start`, `test`), and Node.js version for the backend.
*   `tsconfig.json`: TypeScript compiler configuration for the backend.
*   `dist/`: Output directory for compiled JavaScript files from `.ts` files (backend).
*   `frontend/`: Contains the separate Next.js frontend application (see `frontend/README.md`).
