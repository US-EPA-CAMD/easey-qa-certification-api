import { Test, TestingModule } from '@nestjs/testing';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { CalibrationInjection } from '../entities/calibration-injection.entity';
import { CalibrationInjectionRepository } from './calibration-injection.repository';
import { CalibrationInjectionService } from './calibration-injection.service';

const id = '';
const testSumId = '';
const entity = new CalibrationInjection();
const dto = new CalibrationInjectionDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('CalibrationInjectionService', () => {
  let service: CalibrationInjectionService;
  let repository: CalibrationInjectionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalibrationInjectionService,
        {
          provide: CalibrationInjectionRepository,
          useFactory: mockRepository,
        },
        {
          provide: CalibrationInjectionMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<CalibrationInjectionService>(
      CalibrationInjectionService,
    );
    repository = module.get<CalibrationInjectionRepository>(
      CalibrationInjectionRepository,
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
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getCalibrationInjection(id, testSumId);
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
});
