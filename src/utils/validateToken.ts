import jwt from 'jsonwebtoken';
import { config } from '../config';

export function validarToken(token?: string) {
  if (!token) {
    throw new Error('Token requerido');
  }
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    console.error('Error al validar el token:', err);
    throw new Error('Token inválido');
  }
}
