import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { STATUS_CODE } from '../config/constants';
import { config } from '../config';
import { scanCommandDynamo } from '../lib/dynamo.client';


export const historial: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {

    const limit = parseInt(event.queryStringParameters?.limit ?? '10');
    const lastKey = event.queryStringParameters?.lastKey;

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
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return {
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: 'Error al obtener el historial' }),
    };
  }
};
