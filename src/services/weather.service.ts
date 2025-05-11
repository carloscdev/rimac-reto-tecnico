import { config } from '../config';
import { WeatherResponse } from '../interfaces/weather.interface';


export const getWeatherData = async (city: string): Promise<WeatherResponse> => {
  const url = `${config.WEATHER_API_URL}?q=${city}&appid=${config.WEATHER_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al obtener los datos del clima: ${response.statusText}`);
  }

  const data = await response.json() as WeatherResponse;
  return data;
};
