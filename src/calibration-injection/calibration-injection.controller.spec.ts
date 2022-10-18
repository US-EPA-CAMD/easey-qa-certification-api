import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { CalibrationInjectionController } from './calibration-injection.controller';
import { CalibrationInjectionService } from './calibration-injection.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const testSumId = '';
const id = '';
const dto = new CalibrationInjectionDTO();

const mockService = () => ({
  getCalibrationInjection: jest.fn().mockResolvedValue(dto),
  getCalibrationInjections: jest.fn().mockResolvedValue([dto]),
});

describe('CalibrationInjectionController', () => {
  let controller: CalibrationInjectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CalibrationInjectionController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: CalibrationInjectionService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<CalibrationInjectionController>(
      CalibrationInjectionController,
    );
  });

  describe('getCalibrationInjection', () => {
    it('Calls the service to get a Calibration Injection record', async () => {
      const result = await controller.getCalibrationInjection(
        locId,
        testSumId,
        id,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('getCalibrationInjections', () => {
    it('Calls the service to many Calibration Injection records', async () => {
      const result = await controller.getCalibrationInjections(
        locId,
        testSumId,
      );
      expect(result).toEqual([dto]);
    });
  });
});
