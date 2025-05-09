import { getStarWarsData } from '../src/services/starwars.service';

global.fetch = jest.fn();

describe('getStarWarsData', () => {
  it('debería obtener los datos correctamente de la API de Star Wars', async () => {
    // Simulando la respuesta de la API
    const mockResponse = {
      ok: true,
      json: async () => ({
        result: {
          properties: {
            name: 'Luke Skywalker',
            gender: 'male',
            birth_year: '19BBY',
            skin_color: 'fair',
            hair_color: 'blond',
            height: '172',
            eye_color: 'blue',
          },
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const characterId = 1;
    const data = await getStarWarsData(characterId);

    expect(data).toEqual({
      name: 'Luke Skywalker',
      gender: 'male',
      birth_year: '19BBY',
      skin_color: 'fair',
      hair_color: 'blond',
      height: '172',
      eye_color: 'blue',
    });
  });

  it('debería lanzar un error si la respuesta no es válida', async () => {
    const mockResponse = { ok: false };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    try {
      await getStarWarsData(1);
    } catch (error: any) {
      expect(error.message).toBe('Error al obtener los datos de Star Wars API');
    }
  });
});
