"use client";

import { useState } from 'react';
import Image from 'next/image';
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
  };
}

const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  const response = await fetch(`http://localhost:8000/api/weather?city=${city}&appid=YOUR_API_KEY`);
  const data = await response.json();
  return data;
};

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleSearch = async () => {
    const data = await fetchWeatherData(city);
    setWeatherData(data);
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

      {weatherData && (
        <div className={styles.results}>
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
      )}
    </main>
  );
}
