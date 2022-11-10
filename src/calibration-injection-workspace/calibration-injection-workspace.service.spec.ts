import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { CalibrationInjectionRepository } from '../calibration-injection/calibration-injection.repository';
import {
  CalibrationInjectionBaseDTO,
  CalibrationInjectionDTO,
} from '../dto/calibration-injection.dto';
import { CalibrationInjection } from '../entities/workspace/calibration-injection.entity';
import { CalibrationInjection as CalibrationInjectionOfficial } from '../entities/calibration-injection.entity';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CalibrationInjectionWorkspaceRepository } from './calibration-injection-workspace.repository';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';
import { Logger } from '@us-epa-camd/easey-common/logger';

const id = '';
const testSumId = '';
const userId = 'user';
const entity = new CalibrationInjection();
const dto = new CalibrationInjectionDTO();

const payload = new CalibrationInjectionBaseDTO();

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

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockHistoricalRepo = () => ({
  findOne: jest.fn().mockResolvedValue(new CalibrationInjectionOfficial()),
});

describe('CalibrationInjectionWorkspaceService', () => {
  let service: CalibrationInjectionWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: CalibrationInjectionWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        CalibrationInjectionWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: CalibrationInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: CalibrationInjectionRepository,
          useFactory: mockHistoricalRepo,
        },
        {
          provide: CalibrationInjectionMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<CalibrationInjectionWorkspaceService>(
      CalibrationInjectionWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<CalibrationInjectionWorkspaceRepository>(
      CalibrationInjectionWorkspaceRepository,
    );
  });

  describe('getCalibrationInjections', () => {
    it('Should return Calibration Injection records by Test Summary id', async () => {
      const result = await service.getCalibrationInjections(testSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getCalibrationInjection', () => {
    it('Should return a Calibration Injection record', async () => {
      const result = await service.getCalibrationInjection(id, testSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Calibration Injection record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getCalibrationInjection(id, testSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createCalibrationInjection', () => {
    it('Should create and return a new Calibration Injection record', async () => {
      const result = await service.createCalibrationInjection(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should create and return a new Calibration Injection record with Historical Record Id', async () => {
      const result = await service.createCalibrationInjection(
        testSumId,
        payload,
        userId,
        false,
        'historicalId',
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('updateCalibrationInjection', () => {
    it('Should update and return the Calibration Injection record', async () => {
      const result = await service.updateCalibrationInjection(
        testSumId,
        id,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when a Calibration Injection record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.updateCalibrationInjection(
          testSumId,
          id,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteCalibrationInjection', () => {
    it('Should delete a Calibration Injection record', async () => {
      const result = await service.deleteCalibrationInjection(
        testSumId,
        id,
        userId,
      );

      expect(result).toEqual(undefined);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when database throws an error while deleting a Calibration Injection record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteCalibrationInjection(testSumId, id, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('getCalibrationInjectionByTestSumIds', () => {
    it('Should get Calibration Injection records by test sum ids', async () => {
      const result = await service.getCalibrationInjectionByTestSumIds([
        testSumId,
      ]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Calibration Injection Record', async () => {
      jest
        .spyOn(service, 'getCalibrationInjectionByTestSumIds')
        .mockResolvedValue([]);

      const result = await service.export([testSumId]);
      expect(result).toEqual([]);
    });
  });

  describe('import', () => {
    it('Should Import Calibration Injection', async () => {
      jest.spyOn(service, 'createCalibrationInjection').mockResolvedValue(dto);

      await service.import(testSumId, payload, userId, false);
    });

    it('Should Import Calibration Injection from Historical Record', async () => {
      jest.spyOn(service, 'createCalibrationInjection').mockResolvedValue(dto);

      await service.import(testSumId, payload, userId, true);
    });
  });
});
