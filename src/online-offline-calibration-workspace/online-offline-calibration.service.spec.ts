import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { DataSource, EntityManager } from 'typeorm';

import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibration } from '../entities/workspace/online-offline-calibration.entity';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { OnlineOfflineCalibrationRepository } from '../online-offline-calibration/online-offline-calibration.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { OnlineOfflineCalibrationWorkspaceRepository } from './online-offline-calibration.repository';
import { OnlineOfflineCalibrationWorkspaceService } from './online-offline-calibration.service';

const testSumId = '1';
const onlineOfflineCalibrationId = 'abc123';
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
  findOneBy: jest.fn().mockResolvedValue(onlineOfflineCalibration),
  find: jest.fn().mockResolvedValue([onlineOfflineCalibration]),
  delete: jest.fn().mockResolvedValue(null),
});

const mockOfficialRepo = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(onlineOfflineCalibrationDTO),
  many: jest.fn().mockResolvedValue([onlineOfflineCalibrationDTO]),
});

describe('OnlineOfflineCalibrationWorkspaceService', () => {
  let service: OnlineOfflineCalibrationWorkspaceService;
  let repository: OnlineOfflineCalibrationWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        OnlineOfflineCalibrationWorkspaceService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: OnlineOfflineCalibrationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: OnlineOfflineCalibrationRepository,
          useFactory: mockOfficialRepo,
        },
        {
          provide: OnlineOfflineCalibrationMap,
          useFactory: mockMap,
        },
        {
          provide: EntityManager,
          useFactory: () => ({
            getRepository: jest.fn().mockReturnValue({
              create: jest.fn().mockReturnValue(onlineOfflineCalibration),
              save: jest.fn().mockResolvedValue(onlineOfflineCalibration),
              findOneBy: jest.fn().mockResolvedValue(onlineOfflineCalibration),
              delete: jest.fn().mockResolvedValue(null),
            }),
          }),
        },
      ],
    }).compile();

    service = module.get<OnlineOfflineCalibrationWorkspaceService>(
      OnlineOfflineCalibrationWorkspaceService,
    );
    repository = module.get<OnlineOfflineCalibrationWorkspaceRepository>(
      OnlineOfflineCalibrationWorkspaceRepository,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    entityManager = module.get<EntityManager>(EntityManager);
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

    it('Calls the repository to insert an Online Offline Calibration record with transaction', async () => {
      const result = await service.createOnlineOfflineCalibration(
        testSumId,
        payload,
        userId,
        false,
        null,
        entityManager,
      );
      expect(result).toEqual(onlineOfflineCalibrationDTO);
      expect(entityManager.getRepository).toHaveBeenCalled();
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalledWith(
        testSumId,
        userId,
        false,
        entityManager,
      );
    });
  });

  describe('deleteOnlineOfflineCalibration', () => {
    it('should delete a Online Offline Calibration record', async () => {
      const result = await service.deleteOnlineOfflineCalibration(
        testSumId,
        onlineOfflineCalibrationId,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('should delete a Online Offline Calibration record with transaction', async () => {
      const result = await service.deleteOnlineOfflineCalibration(
        testSumId,
        onlineOfflineCalibrationId,
        userId,
        false,
        entityManager,
      );
      expect(result).toEqual(undefined);
      expect(entityManager.getRepository).toHaveBeenCalled();
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalledWith(
        testSumId,
        userId,
        false,
        entityManager,
      );
    });

    it('should throw error while deleting a Online Offline Calibration record', async () => {
      const error = new EaseyException(
        new Error(
          `Error deleting Online Offline Calibration with record Id [${onlineOfflineCalibrationId}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteOnlineOfflineCalibration(
          testSumId,
          onlineOfflineCalibrationId,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('updateOnlineOfflineCalibration', () => {
    it('Calls the repository to update an existing Online Offline Calibration record', async () => {
      const result = await service.updateOnlineOfflineCalibration(
        testSumId,
        onlineOfflineCalibrationId,
        payload,
        userId,
      );
      expect(result).toEqual(onlineOfflineCalibrationDTO);
      expect(repository.save).toHaveBeenCalled();
    });

    it('Calls the repository to update an existing Online Offline Calibration record with transaction', async () => {
      const result = await service.updateOnlineOfflineCalibration(
        testSumId,
        onlineOfflineCalibrationId,
        payload,
        userId,
        false,
        entityManager,
      );
      expect(result).toEqual(onlineOfflineCalibrationDTO);
      expect(entityManager.getRepository).toHaveBeenCalled();
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalledWith(
        testSumId,
        userId,
        false,
        entityManager,
      );
    });
  });

  describe('Export', () => {
    it('Should Export Online Offline Calibration', async () => {
      jest
        .spyOn(service, 'onlineOfflineCalibrationByTestSumIds')
        .mockResolvedValue([onlineOfflineCalibrationDTO]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([onlineOfflineCalibrationDTO]);
    });
  });

  describe('Import', () => {
    it('Should Import Online Offline Calibration', async () => {
      jest
        .spyOn(service, 'createOnlineOfflineCalibration')
        .mockResolvedValue(onlineOfflineCalibrationDTO);

      await service.import(testSumId, payload, userId, false);
      expect(service.createOnlineOfflineCalibration).toHaveBeenCalled();
    });

    it('Should Import Online Offline Calibration with transaction', async () => {
      jest
        .spyOn(service, 'createOnlineOfflineCalibration')
        .mockResolvedValue(onlineOfflineCalibrationDTO);

      await service.import(testSumId, payload, userId, false, entityManager);
      expect(service.createOnlineOfflineCalibration).toHaveBeenCalledWith(
        testSumId,
        payload,
        userId,
        true,
        null,
        entityManager,
      );
    });
  });
});
