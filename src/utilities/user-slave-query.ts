import { DataSource } from 'typeorm';

export async function useSlaveQueryRunner<T>(
  dataSource: DataSource,
  callback: (query) => Promise<T>,
): Promise<T> {
  const qr = dataSource.createQueryRunner('slave');
  await qr.connect();
  try {
    return await callback(qr.manager);
  } finally {
    await qr.release();
  }
}