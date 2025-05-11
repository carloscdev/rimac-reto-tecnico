import { config } from '../config';
import { StarWarsRawResponse, StarWarsResponse } from '../interfaces/starwars.interface';

export const getStarWarsData = async (characterId: number): Promise<StarWarsResponse> => {
  const response = await fetch(`${config.SWAPI_URL}/people/${characterId}`);

  if (!response.ok) {
    throw new Error('Error al obtener los datos de Star Wars API');
  }

  const data = await response.json() as StarWarsRawResponse;

  if (data?.result?.properties) {
    return data.result.properties;
  } else {
    throw new Error('Datos inesperados en la respuesta de Star Wars API');
  }
};
