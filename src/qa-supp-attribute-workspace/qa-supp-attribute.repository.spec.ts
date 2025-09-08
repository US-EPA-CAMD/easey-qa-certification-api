import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { QASuppAttributeWorkspaceRepository } from './qa-supp-attribute.repository';

const mockEntityManager = () => ({});

describe('QASuppAttributeWorkspaceRepository', () => {
  let repository: QASuppAttributeWorkspaceRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QASuppAttributeWorkspaceRepository,
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    repository = module.get<QASuppAttributeWorkspaceRepository>(
      QASuppAttributeWorkspaceRepository,
    );
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(entityManager).toBeDefined();
  });
});