'use client'
import conf from '@/conf/conf';
import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiStrongWind, WiHumidity } from 'react-icons/wi';

interface WeatherData {
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
  };
  wind: {
    speed: number;
  };
  name: string;
  timezone: number;
  sys: {
    country: string;
  };
}

const WeatherComponent: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('Kathmandu,Nepal');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
           const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${conf.weatherApiKey}&units=metric`);
        if (!res.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data: WeatherData = await res.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Failed to fetch weather data. Please try again later.');
        setWeather(null);
      }
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return <WiDaySunny className="w-16 h-16 text-yellow-400" />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <WiCloudy className="w-16 h-16 text-gray-400" />;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <WiRain className="w-16 h-16 text-blue-400" />;
      default:
        return <WiDaySunny className="w-16 h-16 text-yellow-400" />;
    }
  };

  const formatTime = (timezone: number) => {
    const date = new Date();
    const localTime = date.getTime();
    const localOffset = date.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const cityTime = utc + (1000 * timezone);
    const cityDate = new Date(cityTime);
    return cityDate.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Weather</h2>
      <select 
        className="w-full p-2 mb-4 border rounded"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="Kathmandu,Nepal">Kathmandu, Nepal</option>
        <option value="New York,USA">New York, USA</option>
        <option value="London,UK">London, UK</option>
      </select>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.weather[0].icon)}
            <div>
              <h3 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h3>
              <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
              <p className="text-gray-600">{weather.weather[0].description}</p>
              <p className="text-sm">Local time: {formatTime(weather.timezone)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p><span className="font-semibold">Feels like:</span> {Math.round(weather.main.feels_like)}°C</p>
              <p><span className="font-semibold">Min Temp:</span> {Math.round(weather.main.temp_min)}°C</p>
              <p><span className="font-semibold">Max Temp:</span> {Math.round(weather.main.temp_max)}°C</p>
            </div>
            <div>
              <p><span className="font-semibold">Pressure:</span> {weather.main.pressure} hPa</p>
              <p><span className="font-semibold">Humidity:</span> {weather.main.humidity}%</p>
              <p><span className="font-semibold">Wind Speed:</span> {weather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;