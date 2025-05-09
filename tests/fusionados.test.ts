process.env.DYNAMODB_TABLE = 'tabla-test';

const sendMock = jest.fn();

jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({ send: sendMock })),
    },
    GetCommand: jest.fn(),
    PutCommand: jest.fn(),
  };
});

import { fusionados } from '../src/handlers/fusionados';
import * as starwarsService from '../src/services/starwars.service';
import * as weatherService from '../src/services/weather.service';
import { STATUS_CODE } from '../src/config/constants';
import { APIGatewayProxyResult } from 'aws-lambda';

jest.mock('../src/services/starwars.service');
jest.mock('../src/services/weather.service');


describe('fusionados handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe retornar datos fusionados correctamente', async () => {
    (starwarsService.getStarWarsData as jest.Mock).mockResolvedValue({
      name: 'Luke Skywalker',
      gender: 'male',
      birth_year: '19BBY',
      skin_color: 'fair',
      hair_color: 'blond',
      height: '172',
      eye_color: 'blue',
    });

    (weatherService.getWeatherData as jest.Mock).mockResolvedValue({
      weather: [{ description: 'clear sky' }],
      main: { temp: 300 },
    });

    sendMock.mockResolvedValueOnce({ Item: null });
    sendMock.mockResolvedValueOnce({});

    const mockEvent = {
      queryStringParameters: { character: '1' },
    } as any;

    const result = await fusionados(mockEvent, {} as any, () => {}) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(STATUS_CODE.OK);
    const body = JSON.parse(result.body);
    expect(body.character.name).toBe('Luke Skywalker');
    expect(body.planet.weather).toBe('clear sky');
    expect(sendMock).toHaveBeenCalled();
  });

  it('debe retornar error si el ID es inválido', async () => {
    const mockEvent = {
      queryStringParameters: { character: '100' },
    } as any;

    const result = await fusionados(mockEvent, {} as any, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(STATUS_CODE.BAD_REQUEST);
  });

  it('debe retornar error 500 si getStarWarsData lanza error', async () => {
    (starwarsService.getStarWarsData as jest.Mock).mockRejectedValue(new Error('error'));
    const mockEvent = { queryStringParameters: { character: '1' } } as any;

    sendMock.mockResolvedValueOnce({ Item: null });

    const result = await fusionados(mockEvent, {} as any, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });
});
