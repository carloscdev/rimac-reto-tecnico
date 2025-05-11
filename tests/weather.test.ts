import { getWeatherData } from '../src/services/weather.service';

describe('getWeatherData', () => {
  const city = 'Lima';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debería obtener datos del clima correctamente', async () => {
    const mockWeather = {
      weather: [{ description: 'clear sky' }],
      main: { temp: 25 },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeather,
    });

    const data = await getWeatherData(city);
    expect(data).toEqual(mockWeather);
  });

  it('debería lanzar error si la respuesta no es OK', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(getWeatherData(city)).rejects.toThrow('Error al obtener los datos del clima: Not Found');
  });
});
