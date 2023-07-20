import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AirEmissionTestingRepository } from '../air-emission-testing/air-emission-testing.repository';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingDTO,
  AirEmissionTestingImportDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTesting } from '../entities/workspace/air-emission-test.entity';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';
import { ConfigService } from '@nestjs/config';

const id = '';
const testSumId = '';
const airEmissiontestingId = '';
const historicalRecordId = '1';
const userId = 'user';
const entity = new AirEmissionTesting();
const airEmissionTestingRecord = new AirEmissionTestingDTO();

const payload: AirEmissionTestingBaseDTO = new AirEmissionTestingBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(airEmissionTestingRecord),
  many: jest.fn().mockResolvedValue([airEmissionTestingRecord]),
});

const mockHistoricalRepository = () => ({
  findOne: jest.fn().mockResolvedValue(airEmissionTestingRecord),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('AirEmissionTestingWorkspaceService', () => {
  let service: AirEmissionTestingWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: AirEmissionTestingWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        AirEmissionTestingWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AirEmissionTestingWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AirEmissionTestingRepository,
          useFactory: mockHistoricalRepository,
        },
        {
          provide: AirEmissionTestingMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AirEmissionTestingWorkspaceService>(
      AirEmissionTestingWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<AirEmissionTestingWorkspaceRepository>(
      AirEmissionTestingWorkspaceRepository,
    );
  });

  describe('getAirEmissionTestings', () => {
    it('Should return Air Emission Testing records by Test Summary id', async () => {
      const result = await service.getAirEmissionTestings(testSumId);

      expect(result).toEqual([airEmissionTestingRecord]);
    });
  });

  describe('getAirEmissionTesting', () => {
    it('Should return a Air Emission Testing record', async () => {
      const result = await service.getAirEmissionTesting(id);

      expect(result).toEqual(airEmissionTestingRecord);
    });

    it('Should throw error when a Air Emission Testing record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getAirEmissionTesting(id);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createAirEmissionTesting', () => {
    it('Should create and return a new Air Emission Test record', async () => {
      const result = await service.createAirEmissionTesting(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(airEmissionTestingRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should create and return a new Air Emission Test record using historical Record id', async () => {
      const result = await service.createAirEmissionTesting(
        testSumId,
        payload,
        userId,
        false,
        historicalRecordId,
      );

      expect(result).toEqual(airEmissionTestingRecord);
    });
  });

  describe('updateAirEmissionTesting', () => {
    it('should update a Air Emission Testing record', async () => {
      const result = await service.updateAirEmissionTesting(
        testSumId,
        airEmissiontestingId,
        payload,
        userId,
      );
      expect(result).toEqual(airEmissionTestingRecord);
    });

    it('should throw error with invalid Air Emission Testing', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateAirEmissionTesting(
          testSumId,
          airEmissiontestingId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteAirEmissionTesting', () => {
    it('Should delete a Air Emission Testing record', async () => {
      const result = await service.deleteAirEmissionTesting(
        testSumId,
        airEmissiontestingId,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Air Emission Testing record', async () => {
      const error = new EaseyException(
        new Error(
          `Error deleting Air Emission Testing with record Id [${airEmissiontestingId}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteAirEmissionTesting(
          testSumId,
          airEmissiontestingId,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('Export', () => {
    it('Should Export Air Emission Testing', async () => {
      jest
        .spyOn(service, 'getAirEmissionTestingByTestSumIds')
        .mockResolvedValue([airEmissionTestingRecord]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([airEmissionTestingRecord]);
    });
  });

  describe('Import', () => {
    it('Should Import Air Emission Testing', async () => {
      jest
        .spyOn(service, 'createAirEmissionTesting')
        .mockResolvedValue(airEmissionTestingRecord);

      await service.import(
        testSumId,
        new AirEmissionTestingImportDTO(),
        userId,
        true,
      );
    });
  });
});
