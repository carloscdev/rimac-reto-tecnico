import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, GetCommandInput, PutCommand, PutCommandInput, ScanCommandInput, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const getCommandDynamo = async (input: GetCommandInput) => {
  try {
    const result = await dynamoDb.send(new GetCommand(input));
    return result;
  } catch (error) {
    console.error('Error al obtener el elemento:', error);
    throw error;
  }
}

export const putCommandDynamo = async (input: PutCommandInput) => {
  try {
    const result = await dynamoDb.send(new PutCommand(input));
    return result;
  } catch (error) {
    console.error('Error al guardar el elemento:', error);
    throw error;
  }
}

export const scanCommandDynamo = async (input: ScanCommandInput) => {
  try {
    const result = await dynamoDb.send(new ScanCommand(input));
    return result;
  } catch (error) {
    console.error('Error al escanear la tabla:', error);
    throw error;
  }
}