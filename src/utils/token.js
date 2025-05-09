import jwt from 'jsonwebtoken';

const secretKey = 'rimac-seguros-api-key';
const payload = { userId: 'user123' };

const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });

console.log(token);
