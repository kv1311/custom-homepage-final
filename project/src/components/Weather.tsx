import React, { useState, useEffect } from 'react';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, Loader } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
}

const getWeatherIcon = (code: number, className = "w-5 h-5") => {
  if (code === 0) return <Sun className={className} />;
  if ([1, 2, 3].includes(code)) return <Cloud className={className} />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle className={className} />;
  if ([61, 63, 65, 66, 67].includes(code)) return <CloudRain className={className} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className={className} />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className={className} />;
  return <Cloud className={className} />;
};

const getWeatherEmoji = (code: number) => {
  // Clear sky
  if (code === 0) return "☀️";
  
  // Partly cloudy
  if (code === 1) return "🌤️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  
  // Fog
  if ([45, 48].includes(code)) return "🌫️";
  
  // Drizzle
  if ([51, 53, 55].includes(code)) return "🌦️";
  if ([56, 57].includes(code)) return "💧";
  
  // Rain
  if (code === 61) return "🌧️";
  if (code === 63) return "☔";
  if (code === 65) return "🌊";
  
  // Freezing Rain
  if ([66, 67].includes(code)) return "🥶";
  
  // Snow
  if ([71, 73, 75].includes(code)) return "🌨️";
  if ([77].includes(code)) return "❄️";
  if ([85, 86].includes(code)) return "⛄";
  
  // Thunderstorm
  if (code === 95) return "⛈️";
  if (code === 96) return "🌩️";
  if (code === 99) return "⚡";
  
  return "🌈";
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showHourly, setShowHourly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = pos.coords;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&hourly=temperature_2m,weathercode&timezone=auto`
        );
        const data = await response.json();
        
        setWeather({
          temperature: data.current.temperature_2m,
          weatherCode: data.current.weathercode,
          hourly: {
            time: data.hourly.time.slice(0, 24),
            temperature_2m: data.hourly.temperature_2m.slice(0, 24),
            weathercode: data.hourly.weathercode.slice(0, 24),
          },
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="absolute top-6 right-6">
        <Loader className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!weather) return null;

  const currentHour = new Date().getHours();
  const currentIndex = weather.hourly.time.findIndex(time => 
    new Date(time).getHours() === currentHour
  );
  
  const relevantHours = weather.hourly.time
    .slice(Math.max(0, currentIndex - 2), currentIndex + 6)
    .map((time, index) => ({
      hour: new Date(time).getHours(),
      temp: Math.round(weather.hourly.temperature_2m[currentIndex - 2 + index]),
      code: weather.hourly.weathercode[currentIndex - 2 + index]
    }));

  return (
    <div className="absolute top-6 right-6">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all"
        onClick={() => setShowHourly(!showHourly)}
      >
        {getWeatherIcon(weather.weatherCode)}
        <span className="text-sm">{Math.round(weather.temperature)}°C</span>
      </button>

      {showHourly && (
        <div className="absolute top-full right-0 mt-2 p-4 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/5 w-[500px]">
          <div className="flex justify-between">
            {relevantHours.map(({ hour, temp, code }) => (
              <div key={hour} className="text-center px-2">
                <div className="text-xs text-gray-400 mb-1">
                  {hour === currentHour ? 'Now' : `${hour}:00`}
                </div>
                <div className="text-xl mb-1">
                  {getWeatherEmoji(code)}
                </div>
                <div className="text-xs font-light">
                  {temp}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}