import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { STATUS_CODE } from '../config/constants';
import { getStarWarsData } from '../services/starwars.service';
import { getWeatherData } from '../services/weather.service';
import { config } from '../config';
import { getCommandDynamo, putCommandDynamo } from '../lib/dynamo.client';
import { validarToken } from '../utils/validateToken';
import Joi from 'joi';
import { getRandomCity } from '../utils/cities';

const schema = Joi.object({
  characterId: Joi.number().required()
});

export const fusionados: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers.Authorization?.split(' ')[1];
    validarToken(token);
    const characterId = event.queryStringParameters?.character ?? '1';
    const { error } = schema.validate({ characterId });
    if (error) {
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        body: JSON.stringify({ error: error.details[0].message }),
      };
    }

    const cacheKey = `fusion-${characterId}`;
    const now = Date.now();

    const cached = await getCommandDynamo({
      TableName: config.DYNAMODB_TABLE,
      Key: { cacheKey },
    });

    if (cached.Item && now - cached.Item.timestamp < config.CACHE_TTL * 1000) {
      console.log('Datos desde caché');
      const cachedData = {
        ...cached.Item.data,
        isCached: true,
      };
      return {
        statusCode: STATUS_CODE.OK,
        body: JSON.stringify(cachedData),
      };
    }

    const randomCity = getRandomCity();
    const starWarsData = await getStarWarsData(parseInt(characterId));
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

    const showDataToStore = {
      ...fusionData,
      isCached: false,
    };

    return {
      statusCode: STATUS_CODE.OK,
      body: JSON.stringify(showDataToStore),
    };
  } catch (error: any) {
    console.error('Error al fusionar datos:', error);
    const message = error.message ?? 'Error al fusionar datos';
    const statusCode = error.statusCode ?? STATUS_CODE.INTERNAL_SERVER_ERROR;
    return {
      statusCode,
      body: JSON.stringify({ message }),
    };
  }
};
