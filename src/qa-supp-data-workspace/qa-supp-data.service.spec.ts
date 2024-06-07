import { Test, TestingModule } from '@nestjs/testing';

import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';
import { QASuppDataWorkspaceService } from './qa-supp-data.service';

const testSumId = '';
const qaSuppData = new QASuppData();
const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(qaSuppData),
  save: jest.fn().mockResolvedValue(qaSuppData),
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
  });
});
