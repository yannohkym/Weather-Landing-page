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
  const [isFahrenheit, setIsFahrenheit] = useState(false);

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

  const toggleTemperatureUnit = () => {
    setIsFahrenheit(!isFahrenheit);
  };

  const convertToFahrenheit = (temp: number) => (temp * 9/5) + 32;

  return (
    <main className={styles.main}>
      <div className={styles.toggleSwitch}>
        <label className={styles.switch}>
          <input type="checkbox" onChange={toggleTemperatureUnit} />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.switchLabel}>{isFahrenheit ? 'Fahrenheit' : 'Celsius'}</span>
      </div>

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
              <p>Temperature: {isFahrenheit ? convertToFahrenheit(weatherData.main.temp) : weatherData.main.temp}°{isFahrenheit ? 'F' : 'C'}</p>
              <p>Feels Like: {isFahrenheit ? convertToFahrenheit(weatherData.main.feels_like) : weatherData.main.feels_like}°{isFahrenheit ? 'F' : 'C'}</p>
              <p>Min Temp: {isFahrenheit ? convertToFahrenheit(weatherData.main.temp_min) : weatherData.main.temp_min}°{isFahrenheit ? 'F' : 'C'}, Max Temp: {isFahrenheit ? convertToFahrenheit(weatherData.main.temp_max) : weatherData.main.temp_max}°{isFahrenheit ? 'F' : 'C'}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Pressure: {weatherData.main.pressure} hPa</p>
              
              <p>Weather: {weatherData.weather[0].main} - {weatherData.weather[0].description}</p>
              <img 
                 src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                alt={weatherData.weather[0].description} 
              />
            </div>
            <div className={styles.cardContainer}>
             <div className={styles.card}>
             <h3>Yesterday: {weatherData.clouds.all}%</h3>
             <p>Visibility: {weatherData.visibility} meters</p>
             <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
             </div>
             <div className={styles.card}>
            <h3>Today: {weatherData.clouds.all}%</h3>
            <p>Visibility: {weatherData.visibility} meters</p>
            <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
             <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          <div className={styles.card}>
           <h3>Tomorrow: {weatherData.clouds.all}%</h3>
         <p>Visibility: {weatherData.visibility} meters</p>
          <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
        </div>
        </div>
          </div>
          <div className={styles.verticalDivider}></div>
          <div className={styles.resultsColumn}>
            <div className={styles.card}>
              <h3>wind Status</h3>
              <p>Speed: {weatherData.wind.speed} m/s,</p>
              <p>Wind degree:  {weatherData.wind.deg}°</p>
            
            </div>
            <div className={styles.card}>
              <h3>Humidity</h3>
              <p>Base: {weatherData.main.humidity}%</p>
              <p>Data Time: {new Date(weatherData.dt * 1000).toLocaleString()}</p>
              <div className={styles.progressContainer}>
            <div 
            className={styles.progressBar} 
            style={{ width: `${weatherData.main.humidity}%` }}
             >
            {weatherData.main.humidity}%
          </div>
      </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
