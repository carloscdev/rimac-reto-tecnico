import { historial } from '../src/handlers/historial';
import { STATUS_CODE } from '../src/config/constants';

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const actual = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...actual,
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: jest.fn().mockImplementation((command) => {
          if (command.input.Select === 'COUNT') {
            return Promise.resolve({ Count: 100 });
          }
          return Promise.resolve({
            Items: [{ id: 1 }],
            Count: 1,
            LastEvaluatedKey: { cacheKey: 'next-key' },
          });
        }),
      }),
    },
    ScanCommand: actual.ScanCommand,
  };
});

describe('historial handler', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, DYNAMODB_TABLE: 'table-test' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('debe retornar historial correctamente', async () => {
    const event = {
      queryStringParameters: { limit: '5', lastKey: 'fusion-1' },
    } as any;

    const result = await historial(event, {} as any, () => {}) as any;

    expect(result.statusCode).toBe(STATUS_CODE.OK);
    const body = JSON.parse(result.body);
    expect(body.items).toHaveLength(1);
    expect(body.count).toBe(1);
    expect(body.totalCount).toBe(100);
    expect(body.lastKey).toBe('next-key');
  });

  it('debe retornar error si falta DYNAMODB_TABLE', async () => {
    delete process.env.DYNAMODB_TABLE;
    const result = await historial({ queryStringParameters: {} } as any, {} as any, () => {}) as any;
    expect(result.statusCode).toBe(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });
});
