import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  CycleTimeSummaryBaseDTO,
  CycleTimeSummaryDTO,
  CycleTimeSummaryImportDTO,
} from '../dto/cycle-time-summary.dto';
import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { CycleTimeSummary as CycleTimeSummaryOfficial } from '../entities/cycle-time-summary.entity';
import { CycleTimeSummaryWorkspaceRepository } from './cycle-time-summary-workspace.repository';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { InternalServerErrorException } from '@nestjs/common';
import { CycleTimeSummaryRepository } from '../cycle-time-summary/cycle-time-summary.repository';
import { CycleTimeInjectionWorkspaceService } from '../cycle-time-injection-workspace/cycle-time-injection-workspace.service';
import {
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
} from '../dto/cycle-time-injection.dto';

const id = '';
const testSumId = '';
const userId = 'user';
const entity = new CycleTimeSummary();
const dto = new CycleTimeSummaryDTO();

const payload = new CycleTimeSummaryBaseDTO();
const importPayload = new CycleTimeSummaryImportDTO();

const cycleTimeInjDto = new CycleTimeInjectionDTO();
cycleTimeInjDto.cycleTimeSumId = 'SOME_ID';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockCycleTimeInjectionService = () => ({
  import: jest.fn(),
  export: jest.fn().mockResolvedValue([cycleTimeInjDto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockHistoricalRepo = () => ({
  findOne: jest.fn().mockResolvedValue(new CycleTimeSummaryOfficial()),
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
          provide: CycleTimeInjectionWorkspaceService,
          useFactory: mockCycleTimeInjectionService,
        },
        {
          provide: CycleTimeSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: CycleTimeSummaryMap,
          useFactory: mockMap,
        },
        {
          provide: CycleTimeSummaryRepository,
          useFactory: mockHistoricalRepo,
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

  describe('updateCycleTimeSummary', () => {
    it('Should update and return the Cycle Time Summary record', async () => {
      const result = await service.updateCycleTimeSummary(
        testSumId,
        id,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Cycle Time Summary record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.updateCycleTimeSummary(testSumId, id, payload, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteCycleTimeSummary', () => {
    it('Should delete a Cycle Time Summary record', async () => {
      const result = await service.deleteCycleTimeSummary(
        testSumId,
        id,
        userId,
      );

      expect(result).toEqual(undefined);
    });

    it('Should throw error when database throws an error while deleting a Cycle Time Summary record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteCycleTimeSummary(testSumId, id, userId);
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

  describe('import', () => {
    it('Should Import Cycle Time Summary', async () => {
      jest.spyOn(service, 'createCycleTimeSummary').mockResolvedValue(dto);

      await service.import(testSumId, importPayload, userId, false);
    });

    it('Should Import Cycle Time Summary from Historical Record', async () => {
      importPayload.cycleTimeInjectionData = [
        new CycleTimeInjectionImportDTO(),
      ];
      jest.spyOn(service, 'createCycleTimeSummary').mockResolvedValue(dto);

      await service.import(testSumId, importPayload, userId, true);
    });
  });
});
