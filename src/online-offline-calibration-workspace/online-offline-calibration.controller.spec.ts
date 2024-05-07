import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

import {
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationWorkspaceController } from './online-offline-calibration.controller';
import { OnlineOfflineCalibrationWorkspaceService } from './online-offline-calibration.service';

const locId = '';
const testSumId = '';
const onlineOfflineCalibrationId = '';
const user: CurrentUser = {
  clientIp: '',
  expiration: '',
  facilities: [],
  roles: [],
  sessionId: '',
  userId: '',
};
const onlineOfflineCalibrationRecord = new OnlineOfflineCalibrationRecordDTO();
const onlineOfflineCalibrations: OnlineOfflineCalibrationDTO[] = [];
onlineOfflineCalibrations.push(onlineOfflineCalibrationRecord);

const mockService = () => ({
  getOnlineOfflineCalibrations: jest
    .fn()
    .mockResolvedValue(onlineOfflineCalibrations),
  getOnlineOfflineCalibration: jest
    .fn()
    .mockResolvedValue(onlineOfflineCalibrationRecord),
  createOnlineOfflineCalibration: jest.fn(),
  updateOnlineOfflineCalibration: jest.fn(),
  deleteOnlineOfflineCalibration: jest.fn().mockResolvedValue(null),
});

const mockAuthGuard = () => ({});

const mockConfigService = () => ({});

const mockHttpService = () => ({});

const payload = new OnlineOfflineCalibrationBaseDTO();

describe('Online Offline Calibration Workspace Controller', () => {
  let controller: OnlineOfflineCalibrationWorkspaceController;
  let service: OnlineOfflineCalibrationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlineOfflineCalibrationWorkspaceController],
      providers: [
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: AuthGuard,
          useFactory: mockAuthGuard,
        },
        {
          provide: HttpService,
          useFactory: mockHttpService,
        },
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
        {
          provide: OnlineOfflineCalibrationWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<OnlineOfflineCalibrationWorkspaceController>(
      OnlineOfflineCalibrationWorkspaceController,
    );
    service = module.get<OnlineOfflineCalibrationWorkspaceService>(
      OnlineOfflineCalibrationWorkspaceService,
    );
  });

  describe('getOnlineOfflineCalibrations', () => {
    it('Calls the repository to get all Online Offline Calibrations for a Test Summary Id', async () => {
      const result = await controller.getOnlineOfflineCalibrations(
        locId,
        testSumId,
      );
      expect(result).toEqual(onlineOfflineCalibrations);
      expect(service.getOnlineOfflineCalibrations).toHaveBeenCalled();
    });
  });

  describe('getOnlineOfflineCalibration', () => {
    it('Calls the repository to get one Online Offline Calibration by its Id', async () => {
      const result = await controller.getOnlineOfflineCalibration(
        locId,
        testSumId,
        onlineOfflineCalibrationId,
      );
      expect(result).toEqual(onlineOfflineCalibrationRecord);
      expect(service.getOnlineOfflineCalibration).toHaveBeenCalled();
    });
  });

  describe('createOnlineOfflineCalibration', () => {
    it('Should call the service to create a new record', async () => {
      jest
        .spyOn(service, 'createOnlineOfflineCalibration')
        .mockResolvedValue(onlineOfflineCalibrationRecord);
      expect(
        await controller.createOnlineOfflineCalibration(
          locId,
          testSumId,
          payload,
          user,
        ),
      ).toEqual(onlineOfflineCalibrationRecord);
    });
  });

  describe('updateOnlineOfflineCalibration', () => {
    it('Should call the service to update an existing record', async () => {
      jest
        .spyOn(service, 'updateOnlineOfflineCalibration')
        .mockResolvedValue(onlineOfflineCalibrationRecord);
      expect(
        await controller.updateOnlineOfflineCalibration(
          locId,
          testSumId,
          onlineOfflineCalibrationId,
          payload,
          user,
        ),
      ).toEqual(onlineOfflineCalibrationRecord);
    });
  });

  describe('deleteOnlineOfflineCalibration', () => {
    it('should call the RataService.deleteOnlineOfflineCalibration and delete Air Emission Testing record', async () => {
      const result = await controller.deleteOnlineOfflineCalibration(
        locId,
        testSumId,
        onlineOfflineCalibrationId,
        user,
      );
      expect(result).toEqual(null);
    });
  });
});
