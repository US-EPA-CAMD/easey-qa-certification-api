import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibration } from '../entities/online-offline-calibration.entity';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { OnlineOfflineCalibrationRepository } from './online-offline-calibration.repository';
import { OnlineOfflineCalibrationService } from './online-offline-calibration.service';

const testSumId = '1';
const onlineOfflineCalibrationId = 'abc123';
const onlineOfflineCalibration = new OnlineOfflineCalibration();
const onlineOfflineCalibrationDTO = new OnlineOfflineCalibrationDTO();

const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(onlineOfflineCalibration),
  find: jest.fn().mockResolvedValue([onlineOfflineCalibration]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(onlineOfflineCalibrationDTO),
  many: jest.fn().mockResolvedValue([onlineOfflineCalibrationDTO]),
});

describe('OnlineOfflineCalibrationService', () => {
  let service: OnlineOfflineCalibrationService;
  let repository: OnlineOfflineCalibrationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        OnlineOfflineCalibrationService,
        {
          provide: TestSummaryService,
          useFactory: () => {},
        },
        {
          provide: OnlineOfflineCalibrationRepository,
          useFactory: mockRepository,
        },
        {
          provide: OnlineOfflineCalibrationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<OnlineOfflineCalibrationService>(
      OnlineOfflineCalibrationService,
    );
    repository = module.get<OnlineOfflineCalibrationRepository>(
      OnlineOfflineCalibrationRepository,
    );
  });

  describe('getOnlineOfflineCalibration', () => {
    it('Calls repository.findOneBy({id}) to get a single Online Offline Calibration record', async () => {
      const result = await service.getOnlineOfflineCalibration(
        onlineOfflineCalibrationId,
      );
      expect(result).toEqual(onlineOfflineCalibrationDTO);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Online Offline Calibration record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getOnlineOfflineCalibration('invalidId');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getOnlineOfflineCalibrations', () => {
    it('Calls repository to get al Online Offline Calibrations matching a given Test Summary Id', async () => {
      const result = await service.getOnlineOfflineCalibrations(testSumId);
      expect(result).toEqual([onlineOfflineCalibrationDTO]);
    });
  });

  describe('Export', () => {
    it('Should Export Online Offline Calibration', async () => {
      //jest
      //  .spyOn(service, 'onlineOfflineCalibrationByTestSumIds')
      //  .mockResolvedValue([onlineOfflineCalibrationDTO]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([onlineOfflineCalibrationDTO]);
    });
  });
});
