import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { CycleTimeInjectionRepository } from '../cycle-time-injection/cycle-time-injection.repository';
import {
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection as CycleTimeInjectionOfficial } from '../entities/cycle-time-injection.entity';
import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';

const testSumId = '1';
const cycleTimeSumId = '1';
const cycleTimeInjId = '1';
const userId = 'testuser';

const cycleTimeInjection = new CycleTimeInjection();
const cycleTimeInjectionDTO = new CycleTimeInjectionDTO();

const payload = new CycleTimeInjectionImportDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([cycleTimeInjection]),
  create: jest.fn().mockResolvedValue(cycleTimeInjection),
  save: jest.fn().mockResolvedValue(cycleTimeInjection),
  findOneBy: jest.fn().mockResolvedValue(cycleTimeInjection),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(cycleTimeInjectionDTO),
  many: jest.fn().mockResolvedValue([cycleTimeInjectionDTO]),
});

const mockHistoricalRepo = () => ({
  findOneBy: jest.fn().mockResolvedValue(new CycleTimeInjectionOfficial()),
});

describe('CycleTimeInjectionWorkspaceService', () => {
  let service: CycleTimeInjectionWorkspaceService;
  let repository: CycleTimeInjectionWorkspaceRepository;

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
    repository = module.get<CycleTimeInjectionWorkspaceRepository>(
      CycleTimeInjectionWorkspaceRepository,
    );
  });

  describe('getCycleTimeInjections', () => {
    it('should return Cycle Time Injection records by Cycle Time Summary Id', async () => {
      const result = await service.getCycleTimeInjectionsByCycleTimeSumId(
        cycleTimeSumId,
      );

      expect(result).toEqual([cycleTimeInjectionDTO]);
    });
  });

  describe('getCycleTimeInjection', () => {
    it('should return a Cycle Time Summary record', async () => {
      const result = await service.getCycleTimeInjection(cycleTimeInjId);

      expect(result).toEqual(cycleTimeInjectionDTO);
    });

    it('should throw an error when a Cycle Time Injection record is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;

      try {
        await service.getCycleTimeInjection(cycleTimeInjId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
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
    it('Should Import Cycle Time Injection', async () => {
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

    it('Should Import Cycle Time Injection from Historical Record', async () => {
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

  describe('udpateCycleTimeInjection', () => {
    it('should update a Cycle Time Injection record', async () => {
      const result = await service.updateCycleTimeInjection(
        testSumId,
        cycleTimeInjId,
        payload,
        userId,
      );

      expect(result).toEqual(cycleTimeInjectionDTO);
    });

    it('should throw an error while updating a Cycle Time Injection record', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;

      try {
        await service.updateCycleTimeInjection(
          testSumId,
          cycleTimeInjId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteCycleTimeInjection', () => {
    it('should delete Cycle Time Injection record', async () => {
      const result = await service.deleteCycleTimeInjection(
        testSumId,
        cycleTimeInjId,
        userId,
      );

      expect(result).toEqual(undefined);
    });

    it('should throw an error while deleting a Cycle Time Injection record', async () => {
      const error = new InternalServerErrorException(
        `Error deleting Cycle Time Injection record Id [${cycleTimeInjId}]`,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;

      try {
        await service.deleteCycleTimeInjection(
          testSumId,
          cycleTimeInjId,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
