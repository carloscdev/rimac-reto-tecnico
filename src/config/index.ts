const validateEnv = () => {
  const requiredEnvVars = [
    'WEATHER_API_KEY',
    'SWAPI_URL',
    'WEATHER_API_URL',
    'DYNAMODB_TABLE',
    'CACHE_TTL',
    'JWT_SECRET',
  ];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(`Falta la variable de entorno: ${varName}`);
    }
  }


  return {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    SWAPI_URL: process.env.SWAPI_URL,
    WEATHER_API_URL: process.env.WEATHER_API_URL,
    DYNAMODB_TABLE: process.env.DYNAMODB_TABLE,
    CACHE_TTL: parseInt(process.env.CACHE_TTL ?? '1800'),
    JWT_SECRET: process.env.JWT_SECRET ?? '',
  };
};

export const config = validateEnv();