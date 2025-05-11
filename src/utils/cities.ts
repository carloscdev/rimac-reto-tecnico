import { CITIES } from '../config/constants';

export const getRandomCity = (): string => {
  return  CITIES[Math.floor(Math.random() * CITIES.length)]
};