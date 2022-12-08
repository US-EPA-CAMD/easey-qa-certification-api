import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import {
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';
import { CycleTimeInjection as CycleTimeInjectionOfficial } from '../entities/cycle-time-injection.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';
import { CycleTimeInjectionRepository } from '../cycle-time-injection/cycle-time-injection.repository';

const testSumId = '1';
const cycleTimeSumId = '1';
const userId = 'testuser';

const cycleTimeInjection = new CycleTimeInjection();
const cycleTimeInjectionDTO = new CycleTimeInjectionDTO();

const payload = new CycleTimeInjectionImportDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([cycleTimeInjection]),
  create: jest.fn().mockResolvedValue(cycleTimeInjection),
  save: jest.fn().mockResolvedValue(cycleTimeInjection),
  findOne: jest.fn().mockResolvedValue(cycleTimeInjection),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(cycleTimeInjectionDTO),
  many: jest.fn().mockResolvedValue([cycleTimeInjectionDTO]),
});

const mockHistoricalRepo = () => ({
  findOne: jest.fn().mockResolvedValue(new CycleTimeInjectionOfficial()),
});

describe('CycleTimeInjectionWorkspaceService', () => {
  let service: CycleTimeInjectionWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        CycleTimeInjectionWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: CycleTimeInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: CycleTimeInjectionRepository,
          useFactory: mockHistoricalRepo,
        },
        {
          provide: CycleTimeInjectionMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    service = module.get<CycleTimeInjectionWorkspaceService>(
      CycleTimeInjectionWorkspaceService,
    );
  });

  describe('createInjection', () => {
    it('Should insert a Linearity Injection record', async () => {
      const result = await service.createCycleTimeInjection(
        testSumId,
        cycleTimeSumId,
        payload,
        userId,
      );
      expect(result).toEqual(cycleTimeInjectionDTO);
    });

    it('Should create and return a new Cycle Time Injection record with Historical Record Id', async () => {
      const result = await service.createCycleTimeInjection(
        testSumId,
        cycleTimeSumId,
        payload,
        userId,
        false,
        'historicalId',
      );

      expect(result).toEqual(cycleTimeInjectionDTO);
    });
  });

  describe('getCycleTimeInjectionByCycleTimeSumIds', () => {
    it('Should get Cycle Time injection records by cycleTimeSumIds', async () => {
      const result = await service.getCycleTimeInjectionByCycleTimeSumIds([
        cycleTimeSumId,
      ]);
      expect(result).toEqual([cycleTimeInjectionDTO]);
    });
  });

  describe('export', () => {
    it('Should export Cycle Time Injection Record', async () => {
      jest
        .spyOn(service, 'getCycleTimeInjectionByCycleTimeSumIds')
        .mockResolvedValue([]);

      const result = await service.export([cycleTimeSumId]);
      expect(result).toEqual([]);
    });
  });

  describe('import', () => {
    const importPayload = new CycleTimeInjectionImportDTO();
    it('Should Import Cycle Time Summary', async () => {
      jest
        .spyOn(service, 'createCycleTimeInjection')
        .mockResolvedValue(cycleTimeInjectionDTO);

      const result = await service.import(
        testSumId,
        cycleTimeSumId,
        importPayload,
        userId,
        false,
      );
      expect(result).toEqual(null);
    });

    it('Should Import Cycle Time Summary from Historical Record', async () => {
      jest
        .spyOn(service, 'createCycleTimeInjection')
        .mockResolvedValue(cycleTimeInjectionDTO);

      const result = await service.import(
        testSumId,
        cycleTimeSumId,
        importPayload,
        userId,
        true,
      );
      expect(result).toEqual(null);
    });
  });
});
