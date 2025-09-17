import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { QASuppData as QASuppDataGlobal } from '../entities/qa-supp-data.entity';
import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';
import { QASuppDataWorkspaceService } from './qa-supp-data.service';

const testSumId = '';
const qaSuppData = new QASuppData();
const officialRecord = new QASuppDataGlobal();
const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(qaSuppData),
  save: jest.fn().mockResolvedValue(qaSuppData),
  delete: jest.fn().mockResolvedValue(undefined),
  create: jest.fn().mockReturnValue(new QASuppData()),
  find: jest.fn().mockResolvedValue([new QASuppData()]),
});

const mockManager = {
  transaction: jest.fn(),
  getRepository: jest.fn().mockReturnValue({
    delete: jest.fn(),
    create: jest.fn().mockReturnValue(new QASuppData()),
    save: jest.fn().mockResolvedValue(new QASuppData()),
  }),
} as any;

describe('QASuppDataWorkspaceService', () => {
  let service: QASuppDataWorkspaceService;
  let repository: QASuppDataWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QASuppDataWorkspaceService,
        {
          provide: QASuppDataWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useValue: mockManager,
        },
      ],
    }).compile();

    service = module.get<QASuppDataWorkspaceService>(
      QASuppDataWorkspaceService,
    );
    repository = module.get<QASuppDataWorkspaceRepository>(
      QASuppDataWorkspaceRepository,
    );
  });

  describe('setSubmissionAvailCodeToRequire', () => {
    it('calls the repository.findOneBy() and update submissionAvailCode QA-Supp-Data record', async () => {
      await service.setSubmissionAvailCodeToRequire(testSumId);
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('calls the repository.findOneBy() and update submissionAvailCode QA-Supp-Data record with transaction', async () => {
      await service.setSubmissionAvailCodeToRequire(testSumId, mockManager);
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('deleteByTestSumId', () => {
    it('should delete a QA Supplemental Data record by testSumId using the default repository', async () => {
      await service.deleteByTestSumId(testSumId);
      expect(repository.delete).toHaveBeenCalledWith({ testSumId });
    });

    it('should delete a QA Supplemental Data record by testSumId using a transactional manager', async () => {
      const transactionalRepo = mockManager.getRepository();
      await service.deleteByTestSumId(
        testSumId,
        mockManager as unknown as EntityManager,
      );
      expect(mockManager.getRepository).toHaveBeenCalledWith(QASuppData);
      expect(transactionalRepo.delete).toHaveBeenCalledWith({ testSumId });
    });
  });

  describe('createFromOfficialRecord', () => {
    it('should create a new QA Supplemental Data record from an official record using the default repository', async () => {
      await service.createFromOfficialRecord(officialRecord);
      expect(repository.create).toHaveBeenCalledWith(officialRecord);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should create a new QA Supplemental Data record from an official record using a transactional manager', async () => {
      const transactionalRepo = mockManager.getRepository();
      await service.createFromOfficialRecord(
        officialRecord,
        mockManager as unknown as EntityManager,
      );
      expect(mockManager.getRepository).toHaveBeenCalledWith(QASuppData);
      expect(transactionalRepo.create).toHaveBeenCalledWith(officialRecord);
      expect(transactionalRepo.save).toHaveBeenCalled();
    });
  });

});
