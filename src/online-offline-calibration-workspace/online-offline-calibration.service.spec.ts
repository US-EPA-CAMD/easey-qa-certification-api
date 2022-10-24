import { Test, TestingModule } from '@nestjs/testing';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationImportDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibration } from '../entities/workspace/online-offline-calibration.entity';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { OnlineOfflineCalibrationWorkspaceRepository } from './online-offline-calibration.repository';
import { OnlineOfflineCalibrationWorkspaceService } from './online-offline-calibration.service';
import { Logger } from '@us-epa-camd/easey-common/logger';

const testSumId = '1';
const userId = 'testuser';
const onlineOfflineCalibration = new OnlineOfflineCalibration();
const onlineOfflineCalibrationDTO = new OnlineOfflineCalibrationDTO();

const payload = new OnlineOfflineCalibrationDTO();

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(onlineOfflineCalibration),
  save: jest.fn().mockResolvedValue(onlineOfflineCalibration),
  findOne: jest.fn().mockResolvedValue(onlineOfflineCalibration),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(onlineOfflineCalibrationDTO),
});

describe('OnlineOfflineCalibrationWorkspaceService', () => {
  let service: OnlineOfflineCalibrationWorkspaceService;
  let repository: OnlineOfflineCalibrationWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        OnlineOfflineCalibrationWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: OnlineOfflineCalibrationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: OnlineOfflineCalibrationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<OnlineOfflineCalibrationWorkspaceService>(
      OnlineOfflineCalibrationWorkspaceService,
    );
    repository = module.get<OnlineOfflineCalibrationWorkspaceRepository>(
      OnlineOfflineCalibrationWorkspaceRepository,
    );
  });

  describe('createOnlineOfflineCalibration', () => {
    it('Calls the repository to insert an Online Offline Calibration record', async () => {
      const result = await service.createOnlineOfflineCalibration(
        testSumId,
        payload,
        userId,
      );
      expect(result).toEqual(onlineOfflineCalibrationDTO);
      expect(repository.create).toHaveBeenCalled();
    });
  });
});
