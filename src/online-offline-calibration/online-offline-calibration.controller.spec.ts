import { Test, TestingModule } from '@nestjs/testing';
import {
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationController } from './online-offline-calibration.controller';
import { OnlineOfflineCalibrationService } from './online-offline-calibration.service';

const locId = '';
const testSumId = '';
const onlineOfflineCalibrationId = '';
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
});

describe('Online Offline Calibration Controller', () => {
  let controller: OnlineOfflineCalibrationController;
  let service: OnlineOfflineCalibrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlineOfflineCalibrationController],
      providers: [
        {
          provide: OnlineOfflineCalibrationService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<OnlineOfflineCalibrationController>(
      OnlineOfflineCalibrationController,
    );
    service = module.get<OnlineOfflineCalibrationService>(
      OnlineOfflineCalibrationService,
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
});
