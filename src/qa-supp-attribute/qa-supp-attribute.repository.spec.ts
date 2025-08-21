import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { QASuppAttributeRepository } from './qa-supp-attribute.repository';

const mockEntityManager = () => ({});

describe('QASuppAttributeRepository', () => {
  let repository: QASuppAttributeRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QASuppAttributeRepository,
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    repository = module.get<QASuppAttributeRepository>(
      QASuppAttributeRepository,
    );
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(entityManager).toBeDefined();
  });
});