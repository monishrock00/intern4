# SkyCast — Asynchronous JavaScript & RESTful APIs

A responsive weather dashboard that uses asynchronous JavaScript (`fetch`, `async`, and `await`) to retrieve city coordinates and current weather data from public Open-Meteo REST APIs.

## Files
- `index.html` — Dashboard structure and weather metrics
- `style.css` — Responsive dashboard styling
- `script.js` — Geocoding API, weather API, JSON parsing, rendering, and error handling

## How to run
1. Extract the ZIP file.
2. Open the folder in VS Code.
3. Run `index.html` with the Live Server extension or another local web server.
4. Search for a city such as Chennai, London, or Tokyo.

An internet connection is required because the dashboard requests live data from public APIs. No API key is required.

## API flow
1. The user enters a city.
2. The app calls the Open-Meteo geocoding endpoint to find latitude and longitude.
3. It calls the forecast endpoint for current weather values.
4. The JSON response is parsed and values are rendered into the dashboard.
5. Errors and missing cities are displayed as accessible status messages.

## Features
- Modern Fetch API with `async/await`
- JSON parsing and dynamic DOM updates
- Loading, success, and error states
- Search by city name
- Temperature, feels-like temperature, humidity, wind speed, and direction
- Responsive mobile and desktop layout
- Semantic HTML and keyboard focus indicators

## Notes
Weather values are supplied by Open-Meteo and may differ from local weather station observations. This project requires network access to the public API services.
