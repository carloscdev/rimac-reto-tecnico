import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { STATUS_CODE } from '../config/constants';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);


export const historial: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;

    if (!DYNAMODB_TABLE) {
      throw new Error('DYNAMODB_TABLE no está definido en las variables de entorno.');
    }

    const limit = parseInt(event.queryStringParameters?.limit ?? '10');
    const lastKey = event.queryStringParameters?.lastKey;

    const scanParams: any = {
      TableName: DYNAMODB_TABLE,
      Limit: limit,
    };

    if (lastKey) {
      scanParams.ExclusiveStartKey = { cacheKey: lastKey };
    }

    const result = await dynamoDb.send(new ScanCommand(scanParams));

    const totalCountResult = await dynamoDb.send(new ScanCommand({
      TableName: DYNAMODB_TABLE,
      Select: 'COUNT'
    }));

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
