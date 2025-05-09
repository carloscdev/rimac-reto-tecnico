import { APIGatewayProxyEvent } from "aws-lambda";
import { CITIES } from '../../config/constants';

export const getCharacterId = (event: APIGatewayProxyEvent): number => {
  const characterId = event.queryStringParameters?.character ?? '1';
  const characterIdNum = Number(characterId);

  if (isNaN(characterIdNum) || characterIdNum < 1 || characterIdNum > 83) {
    throw new Error('ID de personaje inválido. Debe ser un número entre 1 y 83.');
  }

  return characterIdNum;
};

export const getRandomCity = (): string => {
  return  CITIES[Math.floor(Math.random() * CITIES.length)]
};