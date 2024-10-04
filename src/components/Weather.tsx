'use client'
import conf from '@/conf/conf';
import React, { useState, useEffect } from 'react';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiStrongWind,
  WiHumidity,
} from 'react-icons/wi';

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
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${conf.weatherApiKey}&units=metric`
        );
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
    const cityTime = utc + 1000 * timezone;
    const cityDate = new Date(cityTime);
    return cityDate.toLocaleTimeString();
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Weather Forecast</h2>
      <select
        className="w-full p-3 mb-6 border border-gray-300 rounded bg-white text-black focus:outline-none"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="Kathmandu,Nepal">Kathmandu, Nepal</option>
        <option value="New York,USA">New York, USA</option>
        <option value="London,UK">London, UK</option>
      </select>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Weather Icon & Main Info */}
          <div className="md:col-span-1 flex flex-col items-center">
            {getWeatherIcon(weather.weather[0].icon)}
            <h3 className="text-xl font-semibold mt-2 text-center">
              {weather.name}, {weather.sys.country}
            </h3>
            <p className="text-5xl font-bold mt-2">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="capitalize mt-1 text-lg">{weather.weather[0].description}</p>
            <p className="mt-2 text-sm">Local time: {formatTime(weather.timezone)}</p>
          </div>
          {/* Additional Weather Details */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2 md:mt-0">
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg">
              <WiStrongWind className="w-8 h-8 inline-block mr-2" />
              <p>
                <span className="font-semibold">Wind Speed:</span>{' '}
                {weather.wind.speed} m/s
              </p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg">
              <WiHumidity className="w-8 h-8 inline-block mr-2" />
              <p>
                <span className="font-semibold">Humidity:</span>{' '}
                {weather.main.humidity}%
              </p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg">
              <p>
                <span className="font-semibold">Feels like:</span>{' '}
                {Math.round(weather.main.feels_like)}°C
              </p>
              <p>
                <span className="font-semibold">Min Temp:</span>{' '}
                {Math.round(weather.main.temp_min)}°C
              </p>
              <p>
                <span className="font-semibold">Max Temp:</span>{' '}
                {Math.round(weather.main.temp_max)}°C
              </p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg">
              <p>
                <span className="font-semibold">Pressure:</span>{' '}
                {weather.main.pressure} hPa
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
