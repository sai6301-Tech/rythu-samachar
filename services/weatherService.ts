import { OPENWEATHER_API_KEY } from '@/constants/config';

const BASE = 'https://api.openweathermap.org/data/2.5/weather';

export type WeatherData = {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
};

export async function getWeather(city: string): Promise<WeatherData> {
  try {
    const url = `${BASE}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return {
      city: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed ?? 0,
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch {
    return mockWeather(city);
  }
}

function mockWeather(city: string): WeatherData {
  return {
    city,
    temperature: 32.5,
    feelsLike: 35,
    humidity: 65,
    windSpeed: 12.5,
    condition: 'Partly Cloudy',
    icon: '02d',
  };
}

export function getWeatherEmoji(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('rain')) return '🌧️';
  if (c.includes('cloud')) return '☁️';
  if (c.includes('clear') || c.includes('sun')) return '☀️';
  if (c.includes('storm') || c.includes('thunder')) return '⛈️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('mist') || c.includes('fog')) return '🌫️';
  return '🌤️';
}
