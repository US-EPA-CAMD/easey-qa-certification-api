import {Test, TestingModule} from '@nestjs/testing';
import {EntityManager} from 'typeorm';

import {QASuppData} from '../entities/qa-supp-data.entity';
import {QASuppDataWorkspaceRepository} from './qa-supp-data.repository';
import {QASuppDataWorkspaceService} from './qa-supp-data.service';

const testSumId = 'test-sum-id';
const qaSuppData = new QASuppData();
const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(qaSuppData),
  save: jest.fn().mockResolvedValue(qaSuppData),
  getRepository: jest.fn().mockReturnThis(),
});

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

    describe('Transaction Support', () => {
      it('Should use transaction entity manager when provided', async () => {
        // Mock transaction entity manager
        const mockTrx = {
          getRepository: jest.fn().mockReturnValue({
            findOneBy: jest.fn().mockResolvedValue(qaSuppData),
            save: jest.fn().mockResolvedValue(qaSuppData),
          }),
        } as unknown as EntityManager;

        // Call method with transaction
        await service.setSubmissionAvailCodeToRequire(testSumId, mockTrx);

        // Verify transaction was used
        expect(mockTrx.getRepository).toHaveBeenCalled();
      });
    });
  });
});
