import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  CycleTimeSummaryBaseDTO,
  CycleTimeSummaryDTO,
} from '../dto/cycle-time-summary.dto';
import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { CycleTimeSummaryWorkspaceRepository } from './cycle-time-summary-workspace.repository';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';
import { Logger } from '@us-epa-camd/easey-common/logger';

const id = '';
const testSumId = '';
const userId = 'user';
const entity = new CycleTimeSummary();
const dto = new CycleTimeSummaryDTO();

const payload = new CycleTimeSummaryBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('CycleTimeSummaryWorkspaceService', () => {
  let service: CycleTimeSummaryWorkspaceService;
  let repository: CycleTimeSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        CycleTimeSummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: CycleTimeSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: CycleTimeSummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<CycleTimeSummaryWorkspaceService>(
      CycleTimeSummaryWorkspaceService,
    );
    repository = module.get<CycleTimeSummaryWorkspaceRepository>(
      CycleTimeSummaryWorkspaceRepository,
    );
  });

  describe('getCycleTimeSummaries', () => {
    it('Should return Cycle Time Summary records by Test Summary id', async () => {
      const result = await service.getCycleTimeSummaries(testSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getCycleTimeSummary', () => {
    it('Should return a Cycle Time Summary record', async () => {
      const result = await service.getCycleTimeSummary(id, testSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Cycle Time Summary record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getCycleTimeSummary(id, testSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createCycleTimeSummary', () => {
    it('Should create and return a new Cycle Time Summary record', async () => {
      const result = await service.createCycleTimeSummary(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('Should create and return a new Cycle Time Summary record with Historical Record Id', async () => {
      const result = await service.createCycleTimeSummary(
        testSumId,
        payload,
        userId,
        false,
        'historicalId',
      );

      expect(result).toEqual(dto);
    });
  });
});
