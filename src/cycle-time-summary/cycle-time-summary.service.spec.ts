import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryService } from './cycle-time-summary.service';

import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CycleTimeSummaryRepository } from './cycle-time-summary.repository';

const id = '';
const testSumId = '';
const entity = new CycleTimeSummary();
const dto = new CycleTimeSummaryDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('CycleTimeSummaryService', () => {
  let service: CycleTimeSummaryService;
  let repository: CycleTimeSummaryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        CycleTimeSummaryService,
        {
          provide: CycleTimeSummaryRepository,
          useFactory: mockRepository,
        },
        {
          provide: CycleTimeSummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<CycleTimeSummaryService>(CycleTimeSummaryService);
    repository = module.get<CycleTimeSummaryRepository>(
      CycleTimeSummaryRepository,
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

  describe('getCycleTimeSummaryByTestSumIds', () => {
    it('Should get Cycle Time Summary records by test sum ids', async () => {
      const result = await service.getCycleTimeSummaryByTestSumIds([testSumId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Cycle Time Summary Record', async () => {
      jest
        .spyOn(service, 'getCycleTimeSummaryByTestSumIds')
        .mockResolvedValue([]);

      const result = await service.export([testSumId]);
      expect(result).toEqual([]);
    });
  });
});
