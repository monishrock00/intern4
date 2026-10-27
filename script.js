const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const statusRegion = document.querySelector("#status-region");
const weatherPanel = document.querySelector("#weather-panel");

document.querySelector("#year").textContent = new Date().getFullYear();

const weatherDescriptions = {
  0: ["Clear sky", "☀"], 1: ["Mainly clear", "🌤"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁"], 45: ["Fog", "🌫"], 48: ["Depositing rime fog", "🌫"],
  51: ["Light drizzle", "🌦"], 53: ["Moderate drizzle", "🌦"], 55: ["Dense drizzle", "🌧"],
  56: ["Light freezing drizzle", "🌧"], 57: ["Dense freezing drizzle", "🌧"],
  61: ["Slight rain", "🌦"], 63: ["Moderate rain", "🌧"], 65: ["Heavy rain", "🌧"],
  66: ["Light freezing rain", "🌧"], 67: ["Heavy freezing rain", "🌧"],
  71: ["Slight snow", "🌨"], 73: ["Moderate snow", "🌨"], 75: ["Heavy snow", "❄"],
  77: ["Snow grains", "❄"], 80: ["Slight rain showers", "🌦"], 81: ["Moderate rain showers", "🌧"],
  82: ["Violent rain showers", "⛈"], 85: ["Snow showers", "🌨"], 86: ["Heavy snow showers", "❄"],
  95: ["Thunderstorm", "⛈"], 96: ["Thunderstorm with hail", "⛈"], 99: ["Thunderstorm with heavy hail", "⛈"]
};

function setStatus(message, type = "") {
  statusRegion.textContent = message;
  statusRegion.className = `status-region ${type}`.trim();
}

function formatPlace(place) {
  return [place.name, place.admin1, place.country]
    .filter((part, index, array) => part && array.indexOf(part) === index)
    .join(", ");
}

async function getCoordinates(city) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
  const response = await fetch(url);
  if (!response.ok) throw new Error("City search failed. Please try again.");
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`We couldn't find "${city}". Check the spelling or try another city.`);
  }
  return data.results[0];
}

async function getWeather(place) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
    timezone: "auto"
  });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Weather data is unavailable right now. Please try again later.");
  const data = await response.json();
  if (!data.current) throw new Error("The weather service returned an unexpected response.");
  return data;
}

function displayWeather(place, data) {
  const current = data.current;
  const weather = weatherDescriptions[current.weather_code] || ["Conditions unavailable", "🌡"];
  document.querySelector("#weather-title").textContent = formatPlace(place);
  document.querySelector("#weather-description").textContent = weather[0];
  document.querySelector("#weather-icon").textContent = weather[1];
  document.querySelector("#temperature").textContent = Math.round(current.temperature_2m);
  document.querySelector("#feels-like").textContent = Math.round(current.apparent_temperature);
  document.querySelector("#humidity").textContent = current.relative_humidity_2m;
  document.querySelector("#wind-speed").textContent = Math.round(current.wind_speed_10m);
  document.querySelector("#wind-direction").textContent = Math.round(current.wind_direction_10m);
  const timeText = current.time ? current.time.replace("T", " ") : "Latest available reading";
  document.querySelector("#weather-updated").textContent = `Observation time: ${timeText} (${data.timezone || "local time"})`;
  weatherPanel.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Enter a city name to search.", "error");
    cityInput.focus();
    return;
  }

  searchButton.disabled = true;
  searchButton.textContent = "Searching…";
  weatherPanel.hidden = true;
  setStatus(`Looking up weather for ${city}…`, "loading");

  try {
    const place = await getCoordinates(city);
    const data = await getWeather(place);
    displayWeather(place, data);
    setStatus(`Weather loaded for ${formatPlace(place)}.`, "");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again.", "error");
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Search <span aria-hidden="true">→</span>';
  }
});
