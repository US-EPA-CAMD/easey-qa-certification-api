import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { CycleTimeInjectionService } from '../cycle-time-injection/cycle-time-injection.service';
import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { CycleTimeSummaryRepository } from './cycle-time-summary.repository';
import { CycleTimeSummaryService } from './cycle-time-summary.service';

const id = '';
const testSumId = '';
const entity = new CycleTimeSummary();
const dto = new CycleTimeSummaryDTO();

const cycleTimeInjDto = new CycleTimeInjectionDTO();
cycleTimeInjDto.cycleTimeSumId = 'SOME_ID';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockCycleTimeInjectionService = () => ({
  import: jest.fn(),
  export: jest.fn().mockResolvedValue([cycleTimeInjDto]),
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
          provide: CycleTimeInjectionService,
          useFactory: mockCycleTimeInjectionService,
        },
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
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
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
      dto.id = 'SOME_ID';
      jest
        .spyOn(service, 'getCycleTimeSummaryByTestSumIds')
        .mockResolvedValue([dto]);

      const result = await service.export([testSumId]);
      dto.cycleTimeInjectionData = [cycleTimeInjDto];
      expect(result).toEqual([dto]);
    });
  });
});
