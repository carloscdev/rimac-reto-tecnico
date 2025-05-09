const SWAPI_URL = process.env.SWAPI_URL;

export const getStarWarsData = async (characterId: string) => {
  const response = await fetch(`${SWAPI_URL}/people/${characterId}`);

  if (!response.ok) {
    throw new Error('Error al obtener los datos de Star Wars API');
  }

  const data = await response.json();

  if (data?.result?.properties) {
    return data.result.properties;
  } else {
    throw new Error('Datos inesperados en la respuesta de Star Wars API');
  }
};
