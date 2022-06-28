import { getManager } from 'typeorm';

export const getEntityManager: any = () => {
  return getManager();
};
