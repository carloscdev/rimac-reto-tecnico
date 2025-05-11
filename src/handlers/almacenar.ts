import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { putCommandDynamo } from '../lib/dynamo.client';
import { config } from '../config';
import { validarToken } from '../utils/validateToken';
import { STATUS_CODE } from '../config/constants';

const schema = Joi.object({
  character: Joi.object({
    eye_color: Joi.string().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    skin_color: Joi.string().required(),
    name: Joi.string().required(),
    birth_year: Joi.string().required(),
    hair_color: Joi.string().required(),
    height: Joi.number().integer().min(50).required().messages({
      'number.min': 'La altura debe ser mayor o igual a 50 cm'
    }),
  }).required(),
  planet: Joi.object({
    weather: Joi.string().required(),
    temperature: Joi.number().required()
  }).required()
});

export const almacenar: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers.Authorization?.split(' ')[1];
    validarToken(token);
    const body = JSON.parse(event.body ?? '{}');
    const { error } = schema.validate(body);

    if (error) {
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }
    const randomId = Math.floor(Math.random() * (1000 - 84 + 1)) + 84; // random id between 84 and 1000
    const cacheKey = `fusion-${randomId}`;
    const id = uuidv4()
    const newBody = {
      ...body,
      id,
    }

    const dataToStore = {
      cacheKey,
      timestamp: Date.now(),
      data: newBody
    }

    await putCommandDynamo({
      TableName: config.DYNAMODB_TABLE,
      Item: dataToStore,
    });

    return {
      statusCode: STATUS_CODE.CREATED,
      body: JSON.stringify({ message: 'Datos almacenados correctamente', dataToStore })
    };
  } catch (error: any) {
    console.error('Error al almacenar datos:', error);
    const message = error.message ?? 'Error al almacenar datos';
    const statusCode = error.statusCode ?? STATUS_CODE.INTERNAL_SERVER_ERROR;
    return {
      statusCode,
      body: JSON.stringify({ message })
    };
  }
};
