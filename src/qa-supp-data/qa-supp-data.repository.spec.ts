import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { QASuppDataRepository } from './qa-supp-data.repository';

const mockEntityManager = () => ({});

describe('QASuppDataRepository', () => {
  let repository: QASuppDataRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QASuppDataRepository,
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    repository = module.get<QASuppDataRepository>(
      QASuppDataRepository,
    );
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(entityManager).toBeDefined();
  });
});