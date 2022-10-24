import { Test, TestingModule } from '@nestjs/testing';
import {
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationWorkspaceController } from './online-offline-calibration.controller';
import { OnlineOfflineCalibrationWorkspaceService } from './online-offline-calibration.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

const locId = '';
const testSumId = '';
const user: CurrentUser = {
  clientIp: '',
  expiration: '',
  isAdmin: false,
  roles: [],
  sessionId: '',
  userId: '',
};
const onlineOfflineCalibrationRecord = new OnlineOfflineCalibrationRecordDTO();
const onlineOfflineCalibrations: OnlineOfflineCalibrationDTO[] = [];
onlineOfflineCalibrations.push(onlineOfflineCalibrationRecord);

const mockService = () => ({
  createOnlineOfflineCalibration: jest.fn(),
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

  describe('createOnlineOfflineCalibration', () => {
    it('Should call the service to create a new record', async () => {
      jest
        .spyOn(service, 'createOnlineOfflineCalibration')
        .mockResolvedValue(onlineOfflineCalibrationRecord);
      expect(await controller.create(locId, testSumId, payload, user)).toEqual(
        onlineOfflineCalibrationRecord,
      );
    });
  });
});