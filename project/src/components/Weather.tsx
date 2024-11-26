import React, { useState, useEffect, useRef } from 'react';
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
  if (code === 0) return "☀️";
  if (code === 1) return "🌤️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55].includes(code)) return "🌦️";
  if ([56, 57].includes(code)) return "💧";
  if (code === 61) return "🌧️";
  if (code === 63) return "☔";
  if (code === 65) return "🌊";
  if ([66, 67].includes(code)) return "🥶";
  if ([71, 73, 75].includes(code)) return "🌨️";
  if ([77].includes(code)) return "❄️";
  if ([85, 86].includes(code)) return "⛄";
  if (code === 95) return "⛈️";
  if (code === 96) return "🌩️";
  if (code === 99) return "⚡";
  return "🌈";
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showHourly, setShowHourly] = useState(false);
  const [loading, setLoading] = useState(true);
  const weatherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = pos.coords;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&hourly=temperature_2m,weathercode&forecast_days=2&timezone=auto`
        );
        const data = await response.json();
        
        setWeather({
          temperature: data.current.temperature_2m,
          weatherCode: data.current.weathercode,
          hourly: {
            time: data.hourly.time.slice(0, 48), // Get 48 hours (2 days) of data
            temperature_2m: data.hourly.temperature_2m.slice(0, 48),
            weathercode: data.hourly.weathercode.slice(0, 48),
          },
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 900000); // Refresh every 15 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (weatherRef.current && !weatherRef.current.contains(event.target as Node)) {
        setShowHourly(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div>
        <Loader className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!weather) return null;

  const currentHour = new Date().getHours();
  const currentIndex = weather.hourly.time.findIndex(time => 
    new Date(time).getHours() === currentHour && 
    new Date(time).getDate() === new Date().getDate()
  );
  
  // Get exactly 7 hours: 2 before current, current hour, and 4 after
  const startIndex = Math.max(0, currentIndex - 2);
  const endIndex = startIndex + 7;
  const relevantHours = weather.hourly.time
    .slice(startIndex, endIndex)
    .map((time, index) => ({
      hour: new Date(time).getHours(),
      temp: Math.round(weather.hourly.temperature_2m[startIndex + index]),
      code: weather.hourly.weathercode[startIndex + index],
      isNextDay: new Date(time).getDate() !== new Date().getDate()
    }));

  return (
    <div ref={weatherRef}>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all"
        onClick={() => setShowHourly(!showHourly)}
      >
        {getWeatherIcon(weather.weatherCode)}
        <span className="text-sm">{Math.round(weather.temperature)}°C</span>
      </button>

      {showHourly && (
        <div className="absolute top-full right-0 mt-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 w-[280px]">
          <div className="grid grid-cols-7 gap-0">
            {relevantHours.map(({ hour, temp, code, isNextDay }) => (
              <div key={hour} className="text-center">
                <div className="text-[10px] text-gray-400">
                  {hour === currentHour && !isNextDay ? 'Now' : (
                    <>
                      {hour.toString().padStart(2, '0')}:00
                      {isNextDay && <span className="text-[8px] text-gray-500">+1</span>}
                    </>
                  )}
                </div>
                <div className="text-sm my-0.5">
                  {getWeatherEmoji(code)}
                </div>
                <div className="text-[10px] font-light">
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