import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MatsBulkFileDTO } from '../dto/mats-bulk-file.dto';
import { MatsBulkFileMap } from '../maps/mats-bulk-file.map';
import { MatsBulkFilesReviewAndSubmitRepository } from './mats-bulk-files-review-and-submit.repository';
import { MatsBulkFilesReviewAndSubmitService } from './mats-bulk-files-review-and-submit.service';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args.where['monPlanIdentifier']) {
      return [new MatsBulkFileDTO()];
    } else {
      return [new MatsBulkFileDTO(), new MatsBulkFileDTO()];
    }
  }),
});

const mockMap = () => ({
  many: jest.fn().mockImplementation(args => {
    return args;
  }),
});

describe('MatsBulkFilesReviewAndSubmitService', () => {
  let service: MatsBulkFilesReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        EntityManager,
        MatsBulkFilesReviewAndSubmitService,
        { provide: MatsBulkFileMap, useFactory: mockMap },
        {
          provide: MatsBulkFilesReviewAndSubmitRepository,
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<MatsBulkFilesReviewAndSubmitService>(
      MatsBulkFilesReviewAndSubmitService,
    );
  });

  describe('getMatsBulkFileRecords', () => {
    it('should call the getMatsBulkFileRecords service function given list of orisCodes', async () => {
      jest.spyOn(service, 'returnManager').mockReturnValue({
        find: jest.fn().mockResolvedValue([{}, {}]),
      });
      const result = await service.getMatsBulkFileRecords([3], []);
      expect(result.length).toBe(2);
    });

    it('should call the getTestSummary test summary service function given list of monPlanIds', async () => {
      jest.spyOn(service, 'returnManager').mockReturnValue({
        find: jest.fn().mockResolvedValue([{}]),
      });
      const result = await service.getMatsBulkFileRecords([], ['MOCK']);
      expect(result.length).toBe(1);
    });
  });
});
