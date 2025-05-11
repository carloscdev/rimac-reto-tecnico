import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { STATUS_CODE } from '../config/constants';
import { config } from '../config';
import { scanCommandDynamo } from '../lib/dynamo.client';
import { validarToken } from '../utils/validateToken';
import Joi from 'joi';

const schema = Joi.object({
  limit: Joi.number().integer().min(1).max(10).default(3),
  lastKey: Joi.string().optional()
});


export const historial: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers.Authorization?.split(' ')[1];
    validarToken(token);

    const { error, value } = schema.validate(event.queryStringParameters);

    if (error) {
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        body: JSON.stringify({ error: error.details[0].message }),
      };
    }

    const { limit, lastKey } = value;

    const scanParams: any = {
      TableName: config.DYNAMODB_TABLE,
      Limit: limit,
    };

    if (lastKey) {
      scanParams.ExclusiveStartKey = { cacheKey: lastKey };
    }

    const result = await scanCommandDynamo(scanParams);

    const totalCountResult = await scanCommandDynamo({
      TableName: config.DYNAMODB_TABLE,
      Select: 'COUNT'
    });

    return {
      statusCode: STATUS_CODE.OK,
      body: JSON.stringify({
        items: result.Items,
        count: result.Count,
        totalCount: totalCountResult.Count,
        lastKey: result.LastEvaluatedKey?.cacheKey ?? null,
      }),
    };
  } catch (error: any) {
    console.error('Error al obtener historial:', error);
    const message = error.message ?? 'Error al obtener historial';
    const statusCode = error.statusCode ?? STATUS_CODE.INTERNAL_SERVER_ERROR;
    return {
      statusCode,
      body: JSON.stringify({ message }),
    };
  }
};
