import { EntityManager, Repository } from 'typeorm';

export function withTransaction<E, T extends Repository<E>>(
  repository: T,
  trx?: EntityManager,
) {
  if (!trx) return repository;

  const repositoryConstructor = repository.constructor as {
    new (manager: EntityManager): T;
  };

  const { target, manager, queryRunner, ...otherRepositoryProperties } =
    repository;

  return Object.assign(new repositoryConstructor(trx), {
    ...otherRepositoryProperties,
  });
}