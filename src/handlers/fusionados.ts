import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { CITIES, STATUS_CODE } from '../config/constants';
import { getStarWarsData } from '../services/starwars.service';
import { getWeatherData } from '../services/weather.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const CACHE_TTL = parseInt(process.env.CACHE_TTL ?? '1800');

export const fusionados: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const characterId = event.queryStringParameters?.character ?? '1';
    const characterIdNum = Number(characterId);

    if (isNaN(characterIdNum) || characterIdNum < 1 || characterIdNum > 83) {
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        body: JSON.stringify({ message: 'ID de personaje inválido. Debe ser un número entre 1 y 83.' }),
      };
    }

    const cacheKey = `fusion-${characterId}`;
    const now = Date.now();

    if (!DYNAMODB_TABLE) {
      throw new Error('DYNAMODB_TABLE no está definido en las variables de entorno.');
    }

    const cached = await dynamoDb.send(new GetCommand({
      TableName: DYNAMODB_TABLE,
      Key: { cacheKey },
    }));

    if (cached.Item && now - cached.Item.timestamp < CACHE_TTL * 1000) {
      console.log('Datos desde caché');
      return {
        statusCode: STATUS_CODE.OK,
        body: JSON.stringify(cached.Item.data),
      };
    }

    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
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

    await dynamoDb.send(new PutCommand({
      TableName: DYNAMODB_TABLE,
      Item: dataToStore,
    }));

    return {
      statusCode: STATUS_CODE.OK,
      body: JSON.stringify(fusionData),
    };
  } catch (error) {
    console.error('Error al fusionar datos:', error);
    return {
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: 'Error al obtener los datos' }),
    };
  }
};
