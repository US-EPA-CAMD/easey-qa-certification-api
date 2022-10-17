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
  isAdmin: false,
  roles: [],
};
const dto = new CalibrationInjectionDTO();

const payload = new CalibrationInjectionBaseDTO();

const mockService = () => ({
  createCalibrationInjection: jest.fn().mockResolvedValue(dto),
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

  describe('createCalibrationInjection', () => {
    it('Calls the service and create a new fuel Flow To Load Baseline record', async () => {
      const result = await controller.createCalibrationInjection(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });
});
