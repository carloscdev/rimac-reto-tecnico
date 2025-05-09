const WEATHER_API_URL = process.env.WEATHER_API_URL;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

export const getWeatherData = async (city: string) => {
  const url = `${WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al obtener los datos del clima: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
