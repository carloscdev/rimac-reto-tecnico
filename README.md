# Instrucciones para ejecutar el proyecto en local
## 1. Instalar dependencias

```bash
npm install
```

## 2. Crear un archivo .env

```bash
# .env
WEATHER_API_KEY=xxx
SWAPI_URL=xxx
WEATHER_API_URL=xxx
DYNAMODB_TABLE=xxx
CACHE_TTL=xxx
```
## 3. Levantar el proyecto

```bash
sls offline start
```

## 4. Probar el proyecto

```bash
curl -X GET "http://localhost:3000/dev/fusionados?character=1"
```

# API REST
## Fusionados
### GET /fusionados
https://5s5xn679k2.execute-api.us-east-1.amazonaws.com/dev/fusionados?toke=xxx&character=7

## Historial
### GET /historial
https://5s5xn679k2.execute-api.us-east-1.amazonaws.com/dev/historial?token=xxx&limit=3&lastKey=xxx

## Token de prueba
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNzQ2ODIwMTkyLCJleHAiOjE3NDc0MjQ5OTJ9.NpdaqhmnlxNBdSbyyf0uzVz14UA2SbOvp9oLnveXnIM