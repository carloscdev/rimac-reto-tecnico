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

# API REST
## Fusionados
### GET /fusionados
https://5s5xn679k2.execute-api.us-east-1.amazonaws.com/dev/fusionados?character=7

## Historial
### GET /historial
https://5s5xn679k2.execute-api.us-east-1.amazonaws.com/dev/historial?limit=3&lastKey=xxx

## Almacenar
### POST /almacenar
```json
{
    "character": {
        "eye_color": "black",
        "gender": "male",
        "skin_color": "fair",
        "name": "Prueba 2",
        "birth_year": "8888",
        "hair_color": "black",
        "height": 170
    },
    "planet": {
        "weather": "clouds",
        "temperature": 286.55
    }
}
```
https://5s5xn679k2.execute-api.us-east-1.amazonaws.com/dev/almacenar

## Token de prueba (Bearer)
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNzQ2ODIwMTkyLCJleHAiOjE3NDc0MjQ5OTJ9.NpdaqhmnlxNBdSbyyf0uzVz14UA2SbOvp9oLnveXnIM
```