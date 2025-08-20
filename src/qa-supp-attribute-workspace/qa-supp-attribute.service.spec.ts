import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { QASuppAttribute } from '../entities/workspace/qa-supp-attribute.entity';
import { QASuppAttribute as QASuppAttributeGlobal } from '../entities/qa-supp-attribute.entity';
import { QASuppAttributeWorkspaceRepository } from './qa-supp-attribute.repository';
import { QASuppAttributeWorkspaceService } from './qa-supp-attribute.service';

const officialRecord = new QASuppAttributeGlobal();
const qaSuppAttribute = new QASuppAttribute();

const mockRepository = () => ({
  create: jest.fn().mockReturnValue(qaSuppAttribute),
  save: jest.fn().mockResolvedValue(qaSuppAttribute),
});

const mockManager = {
  getRepository: jest.fn().mockReturnValue({
    create: jest.fn().mockReturnValue(qaSuppAttribute),
    save: jest.fn().mockResolvedValue(qaSuppAttribute),
  }),
};

describe('QASuppAttributeWorkspaceService', () => {
  let service: QASuppAttributeWorkspaceService;
  let repository: QASuppAttributeWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QASuppAttributeWorkspaceService,
        {
          provide: QASuppAttributeWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QASuppAttributeWorkspaceService>(
      QASuppAttributeWorkspaceService,
    );
    repository = module.get<QASuppAttributeWorkspaceRepository>(
      QASuppAttributeWorkspaceRepository,
    );
  });

  describe('createFromOfficialRecord', () => {
    it('should create a new QA Supplemental Attribute record from an official record using the default repository', async () => {
      await service.createFromOfficialRecord(officialRecord);
      expect(repository.create).toHaveBeenCalledWith(officialRecord);
      expect(repository.save).toHaveBeenCalledWith(qaSuppAttribute);
    });

    it('should create a new QA Supplemental Attribute record from an official record using a transactional manager', async () => {
      const transactionalRepo = mockManager.getRepository();
      await service.createFromOfficialRecord(
        officialRecord,
        mockManager as unknown as EntityManager,
      );
      expect(mockManager.getRepository).toHaveBeenCalledWith(QASuppAttribute);
      expect(transactionalRepo.create).toHaveBeenCalledWith(officialRecord);
      expect(transactionalRepo.save).toHaveBeenCalledWith(qaSuppAttribute);
    });
  });
});
