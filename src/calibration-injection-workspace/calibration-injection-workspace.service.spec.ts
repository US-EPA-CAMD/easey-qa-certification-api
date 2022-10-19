import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CalibrationInjectionBaseDTO,
  CalibrationInjectionDTO,
} from '../dto/calibration-injection.dto';
import { CalibrationInjection } from '../entities/calibration-injection.entity';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CalibrationInjectionWorkspaceRepository } from './calibration-injection-workspace.repository';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';

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

describe('CalibrationInjectionWorkspaceService', () => {
  let service: CalibrationInjectionWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: CalibrationInjectionWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
    it('Should delete a Fuel Flow To Load Baseline record', async () => {
      const result = await service.deleteCalibrationInjection(
        testSumId,
        id,
        userId,
      );

      expect(result).toEqual(undefined);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when database throws an error while deleting a Fuel Flow To Load Baseline record', async () => {
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
});
