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

interface ForecastData {
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
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

const fetchForecastData = async (city: string): Promise<ForecastData[] | null> => {
  try {
    const response = await fetch(`http://localhost:8000/api/forecast?city=${city}&appid=YOUR_API_KEY`);
    if (!response.ok) {
      console.error('Failed to fetch forecast data');
      return null;
    }
    const data = await response.json();
    const forecastList: ForecastData[] = data.list.map((item: any) => ({
      date: item.dt_txt.split(' ')[0],
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));
    return forecastList;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return null;
  }
};

export default function Home()
 {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const heade = (
    <header>
      <h1>Weather App</h1>
    </header>
  );
  const handleSearch = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }
    setError(null);
    const weather = await fetchWeatherData(city);
    const forecast = await fetchForecastData(city);
    if (weather) {
      setWeatherData(weather);
    } else {
      setError('Failed to fetch data for the entered city');
    }
    if (forecast) {
      const groupedForecast: { [date: string]: ForecastData[] } = forecast.reduce((acc, item) => {
        (acc[item.date] = acc[item.date] || []).push(item);
        return acc;
      }, {});

      const forecastByDay = Object.keys(groupedForecast).map(date => {
        const dayData = groupedForecast[date];
        const temp_min = Math.min(...dayData.map(d => d.temp_min));
        const temp_max = Math.max(...dayData.map(d => d.temp_max));
        return {
          date,
          temp_min,
          temp_max,
          description: dayData[0].description,
          icon: dayData[0].icon,
        };
      }
    
    
    );

      const today = new Date().toISOString().split('T')[0];
      const nextThreeDays = forecastByDay.filter(day => day.date > today).slice(0, 3);

      setForecastData(nextThreeDays);
    } else {
      setError('Failed to fetch forecast data for the entered city');
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
      <div>
       <h2 className={styles.h2}><b>My weather App</b></h2>
       <h3 className={styles.h3}><b>Give me your city name and i will feed you with forecast and weather details</b></h3>
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
              <p>Weather: {weatherData.weather[0].main} - {weatherData.weather[0].description}</p>
              <img 
                 src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                alt={weatherData.weather[0].description} 
              />
            </div>
          </div>
          {forecastData && (
        <div className={styles.cardContainer}>
          {forecastData.map((day, index) => (
            <div className={styles.card} key={index}>
              <h3>{index === 0 ? 'Tomorrow' : `Day ${index + 1}`}: {new Date(day.date).toLocaleDateString()}</h3>
              <p>
                <img 
                  src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                  alt={day.description} 
                />
              </p>
              <p>Min Temp: {isFahrenheit ? convertToFahrenheit(day.temp_min) : day.temp_min}°{isFahrenheit ? 'F' : 'C'}, Max Temp: {isFahrenheit ? convertToFahrenheit(day.temp_max) : day.temp_max}°{isFahrenheit ? 'F' : 'C'}</p>
            </div>
          ))}
        </div>
      )}
          <div className={styles.verticalDivider}></div>
          <div className={styles.resultsColumn}>
            <div className={styles.card}>
              <h3>Wind Status</h3>
              <p>Speed: {weatherData.wind.speed} m/s</p>
              <div className={styles.pointerContainer}>
                <div 
                  className={styles.pointer} 
                  style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
                ></div>
                <span>{weatherData.wind.deg}°</span>
                </div>
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

<footer>
      <p>Copyright © 2024 Weather App. All rights reserved.</p>
    </footer>
    </main>
  );

 

}
