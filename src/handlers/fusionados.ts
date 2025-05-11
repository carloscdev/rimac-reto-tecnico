import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { STATUS_CODE } from '../config/constants';
import { getStarWarsData } from '../services/starwars.service';
import { getWeatherData } from '../services/weather.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { getCharacterId, getRandomCity } from './utils/fusionados.util';
import { getCommandDynamo, putCommandDynamo } from '../lib/dynamo.client';
import { validarToken } from '../utils/validateToken';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const fusionados: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers.Authorization?.split(' ')[1];
    validarToken(token);
    const characterId = getCharacterId(event);

    const cacheKey = `fusion-${characterId}`;
    const now = Date.now();

    const cached = await getCommandDynamo({
      TableName: config.DYNAMODB_TABLE,
      Key: { cacheKey },
    });

    if (cached.Item && now - cached.Item.timestamp < config.CACHE_TTL * 1000) {
      console.log('Datos desde caché');
      return {
        statusCode: STATUS_CODE.OK,
        body: JSON.stringify(cached.Item.data),
      };
    }

    const randomCity = getRandomCity();
    const starWarsData = await getStarWarsData(characterId);
    const weatherData = await getWeatherData(randomCity);

    const fusionData = {
      id: uuidv4(),
      character: {
        name: starWarsData.name,
        gender: starWarsData.gender,
        birth_year: starWarsData.birth_year,
        skin_color: starWarsData.skin_color,
        hair_color: starWarsData.hair_color,
        height: parseInt(starWarsData.height) / 100,
        eye_color: starWarsData.eye_color,
      },
      planet: {
        weather: weatherData.weather[0].description,
        temperature: weatherData.main.temp,
      },
    };

    const dataToStore = {
      cacheKey,
      timestamp: now,
      data: fusionData,
    };

    await putCommandDynamo({
      TableName: config.DYNAMODB_TABLE,
      Item: dataToStore,
    });

    return {
      statusCode: STATUS_CODE.OK,
      body: JSON.stringify(fusionData),
    };
  } catch (error) {
    console.error('Error al fusionar datos:', error);
    const message = error instanceof Error ? error.message : 'Error al fusionar datos';
    return {
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message }),
    };
  }
};
