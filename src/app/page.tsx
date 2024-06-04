"use client";

import { useState } from 'react';
import styles from './page.module.css';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  coord: {
    lat: number;
    lon: number;
  };
  base: string;
  dt: number;
}

const fetchWeatherData = async (city: string): Promise<WeatherData | null> => {
  try {
    const response = await fetch(`http://localhost:8000/api/weather?city=${city}&appid=YOUR_API_KEY`);
    if (!response.ok) {
      console.error('Failed to fetch weather data');
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }
    setError(null);
    const data = await fetchWeatherData(city);
    if (data) {
      setWeatherData(data);
    } else {
      setError('Failed to fetch data for the entered city');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>
          Search
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {weatherData && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsColumn}>
            <div className={styles.card}>
              <h3>{weatherData.name}, {weatherData.sys.country}</h3>
              <p>Temperature: {weatherData.main.temp}°C</p>
              <p>Feels Like: {weatherData.main.feels_like}°C</p>
              <p>Min Temp: {weatherData.main.temp_min}°C, Max Temp: {weatherData.main.temp_max}°C</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Pressure: {weatherData.main.pressure} hPa</p>
              <p>Wind: {weatherData.wind.speed} m/s, {weatherData.wind.deg}°</p>
              <p>Weather: {weatherData.weather[0].main} - {weatherData.weather[0].description}</p>
            </div>
            <div className={styles.card}>
              <h3>Cloudiness: {weatherData.clouds.all}%</h3>
              <p>Visibility: {weatherData.visibility} meters</p>
              <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className={styles.verticalDivider}></div>
          <div className={styles.resultsColumn}>
            <div className={styles.card}>
              <h3>City Information</h3>
              <p>City: {weatherData.name}</p>
              <p>Country: {weatherData.sys.country}</p>
              <p>Coordinates: {weatherData.coord.lat}, {weatherData.coord.lon}</p>
            </div>
            <div className={styles.card}>
              <h3>Additional Info</h3>
              <p>Base: {weatherData.base}</p>
              <p>Data Time: {new Date(weatherData.dt * 1000).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
