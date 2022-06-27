import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestSummary } from '../entities/test-summary.entity';
import { LinearitySummaryService } from '../linearity-summary/linearity-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryRepository } from './test-summary.repository';

import { TestSummaryService } from './test-summary.service';

const locationId = '121';
const facilityId = 1;
const unitId = '121';
const testSumId = '1';
const userId = 'testuser';

const testSumaary = new TestSummary();
const testSumaaryDto = new TestSummaryDTO();
const lineSumDto = new LinearitySummaryDTO();
lineSumDto.testSumId = testSumId;

const mockRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSumaary),
  getTestSummariesByLocationId: jest.fn().mockResolvedValue([testSumaary]),
  getTestSummariesByUnitStack: jest.fn().mockResolvedValue([testSumaary]),
});

const mockLinearitySummaryService = () => ({
  export: jest.fn().mockResolvedValue([lineSumDto]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(testSumaaryDto),
  many: jest.fn().mockResolvedValue([testSumaaryDto]),
});

describe('TestSummaryService', () => {
  let service: TestSummaryService;
  let repository: TestSummaryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryService,
        {
          provide: LinearitySummaryService,
          useFactory: mockLinearitySummaryService,
        },
        {
          provide: TestSummaryRepository,
          useFactory: mockRepository,
        },
        {
          provide: TestSummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(TestSummaryService);
    repository = module.get(TestSummaryRepository);
  });

  describe('getTestSummaryById', () => {
    it('calls the repository.getTestSummaryById() and get test summary by id', async () => {
      const result = await service.getTestSummaryById(testSumId);
      expect(result).toEqual(testSumaaryDto);
    });

    it('should throw error when test summary not found', async () => {
      jest.spyOn(repository, 'getTestSummaryById').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getTestSummaryById(testSumId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getTestSummariesByLocationId', () => {
    it('calls the repository.getTestSummariesByLocationId() and get test summaries by locationId', async () => {
      const result = await service.getTestSummariesByLocationId(locationId);
      expect(result).toEqual([testSumaaryDto]);
    });
  });

  describe('getTestSummaries', () => {
    it('calls the repository.getTestSummariesByUnitStack() and get test summaries by locationId', async () => {
      const result = await service.getTestSummaries(facilityId, [unitId]);
      expect(result).toEqual([testSumaaryDto]);
    });
  });

  describe('export', () => {
    it('calls the repository.getTestSummariesByUnitStack() and get test summaries by locationId', async () => {
      const returnedSummary = testSumaaryDto;
      returnedSummary.testTypeCode = 'LINE';
      returnedSummary.id = testSumId;

      const spySummaries = jest
        .spyOn(service, 'getTestSummaries')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([testSumaaryDto]);
    });
  });
});
