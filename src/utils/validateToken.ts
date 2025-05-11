import jwt from 'jsonwebtoken';
import { config } from '../config';
import { STATUS_CODE } from '../config/constants';

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export function validarToken(token?: string) {
  if (!token) {
    const statusCode = STATUS_CODE.UNAUTHORIZED;
    const message = 'Token requerido';
    throw new CustomError(message, statusCode);
  }

  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    console.error('Error al validar el token:', err);

    if (err instanceof jwt.TokenExpiredError) {
      const statusCode = STATUS_CODE.UNAUTHORIZED;
      const message = 'Token expirado';
      throw new CustomError(message, statusCode);
    }

    if (err instanceof jwt.JsonWebTokenError) {
      const statusCode = STATUS_CODE.UNAUTHORIZED;
      const message = 'Token inválido';
      throw new CustomError(message, statusCode);
    }

    const statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;
    const message = 'Error al validar el token';
    throw new CustomError(message, statusCode);
  }
}