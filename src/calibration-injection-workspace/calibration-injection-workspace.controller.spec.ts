import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CalibrationInjectionBaseDTO,
  CalibrationInjectionDTO,
} from '../dto/calibration-injection.dto';
import { CalibrationInjectionWorkspaceController } from './calibration-injection-workspace.controller';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

const locId = '';
const testSumId = '';
const id = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const dto = new CalibrationInjectionDTO();

const payload = new CalibrationInjectionBaseDTO();

const mockService = () => ({
  deleteCalibrationInjection: jest.fn().mockResolvedValue(undefined),
  updateCalibrationInjection: jest.fn().mockResolvedValue(dto),
  createCalibrationInjection: jest.fn().mockResolvedValue(dto),
  getCalibrationInjection: jest.fn().mockResolvedValue(dto),
  getCalibrationInjections: jest.fn().mockResolvedValue([dto]),
});

describe('CalibrationInjectionWorkspaceController', () => {
  let controller: CalibrationInjectionWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CalibrationInjectionWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: CalibrationInjectionWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<CalibrationInjectionWorkspaceController>(
      CalibrationInjectionWorkspaceController,
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

  describe('createCalibrationInjection', () => {
    it('Calls the service and create a new Calibration Injection record', async () => {
      const result = await controller.createCalibrationInjection(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateCalibrationInjection', () => {
    it('Calls the service and update a existing Calibration Injection record', async () => {
      const result = await controller.updateCalibrationInjection(
        locId,
        testSumId,
        id,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('deleteCalibrationInjection', () => {
    it('Calls the service and delete a Calibration Injection record', async () => {
      const result = await controller.deleteCalibrationInjection(
        locId,
        testSumId,
        id,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
