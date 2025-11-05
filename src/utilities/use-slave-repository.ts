import { DataSource } from 'typeorm';

export async function useSlaveRepository<T>(
  dataSource: DataSource,
  repositoryClass: new (repoInstance) => T,
  callback: (repository: T) => Promise<any>,
):Promise<any> {
  const qr = dataSource.createQueryRunner('slave');
  await qr.connect();
  try {
    const repo = new repositoryClass(qr.manager);
    return  await callback(repo);
  } finally {
    await qr.release();
  }
}