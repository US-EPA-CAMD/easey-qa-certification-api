import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryWorkspaceService } from '../linearity-summary-workspace/linearity-summary.service';
import { TestSummaryDTO, TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import * as utils from '../utilities/utils';
import { MonitorLocation } from '../entities/monitor-location.entity';

const locationId = '121';
const facilityId = 1;
const unitId = '121';
const testSumId = '1';
const userId = 'testuser';

const testSummary = new TestSummary();
const testSummaryDto = new TestSummaryDTO();
const lineSumDto = new LinearitySummaryDTO();
lineSumDto.testSumId = testSumId;

const payload = new TestSummaryImportDTO();
payload.testTypeCode = 'code';
payload.testNumber = '1';

const mockRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSummary),
  getTestSummariesByLocationId: jest.fn().mockResolvedValue([testSummary]),
  getTestSummariesByUnitStack: jest.fn().mockResolvedValue([testSummary]),
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(testSummary),
  delete: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(testSummary),
  save: jest.fn().mockResolvedValue(testSummary),
});

const mockLinearitySummaryService = () => ({
  export: jest.fn().mockResolvedValue([lineSumDto]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(testSummaryDto),
  many: jest.fn().mockResolvedValue([testSummaryDto]),
});

describe('TestSummaryWorkspaceService', () => {
  let service: TestSummaryWorkspaceService;
  let repository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryWorkspaceService,
        {
          provide: LinearitySummaryWorkspaceService,
          useFactory: mockLinearitySummaryService,
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: TestSummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(TestSummaryWorkspaceService);
    repository = module.get(TestSummaryWorkspaceRepository);
  });

  describe('getTestSummaryById', () => {
    it('calls the repository.getTestSummaryById() and get test summary by id', async () => {
      const result = await service.getTestSummaryById(testSumId);
      expect(result).toEqual(testSummaryDto);
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
      expect(result).toEqual([testSummaryDto]);
    });
  });

  describe('getTestSummaries', () => {
    it('calls the repository.getTestSummariesByUnitStack() and get test summaries by locationId', async () => {
      const result = await service.getTestSummaries(facilityId, [unitId]);
      expect(result).toEqual([testSummaryDto]);
    });
  });

  describe('export', () => {
    it('calls the service.getTestSummaries() and get test summaries by locationId and unitId then export', async () => {
      const returnedSummary = testSummaryDto;
      returnedSummary.testTypeCode = 'LINE';
      returnedSummary.id = testSumId;

      const spySummaries = jest
        .spyOn(service, 'getTestSummaries')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([testSummaryDto]);
    });
  });

  describe('createTestSummary', () => {
    it('should call the createTestSummary and create test summariy', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(new MonitorLocation()),
      };

      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      jest
        .spyOn(repository, 'getTestSummaryById')
        .mockResolvedValue(testSummary);

      const result = await service.createTestSummary(
        locationId,
        payload,
        userId,
      );

      expect(result).toEqual(testSummaryDto);
    });
  });
});
