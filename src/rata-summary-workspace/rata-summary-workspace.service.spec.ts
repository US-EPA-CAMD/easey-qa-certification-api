import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataRunWorkspaceService } from '../rata-run-workspace/rata-run-workspace.service';
import {
  RataSummaryBaseDTO,
  RataSummaryDTO,
  RataSummaryImportDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { RataSummary as RataSummaryOfficial } from '../entities/rata-summary.entity';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';
import { RataRunDTO, RataRunImportDTO } from '../dto/rata-run.dto';
import { RataSummaryRepository } from '../rata-summary/rata-summary.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

const dto = new RataSummaryDTO();

const testSumId = '';
const rataId = '';
const userId = 'testUser';
const entity = new RataSummary();
const record = new RataSummaryRecordDTO();

const payload: RataSummaryBaseDTO = {
  operatingLevelCode: 'H',
  averageGrossUnitLoad: 0,
  referenceMethodCode: '2',
  meanCEMValue: 0,
  meanRATAReferenceValue: 0,
  meanDifference: 0,
  standardDeviationDifference: 0,
  confidenceCoefficient: 0,
  tValue: 0,
  apsIndicator: 0,
  apsCode: 'PS15',
  relativeAccuracy: 0,
  biasAdjustmentFactor: 0,
  co2OrO2ReferenceMethodCode: 'L',
  stackDiameter: 0,
  stackArea: 0,
  numberOfTraversePoints: 0,
  calculatedWAF: 0,
  defaultWAF: 0,
};

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  findOne: jest.fn().mockResolvedValue(entity),
  find: jest.fn().mockResolvedValue([entity]),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRataRunService = () => ({
  export: jest.fn().mockResolvedValue([new RataRunDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const officialRecord = new RataSummaryOfficial();
officialRecord.id = 'uuid';

const mockOfficialRepository = () => ({
  findOne: jest.fn().mockResolvedValue(officialRecord),
});

describe('RataSummaryWorkspaceService', () => {
  let service: RataSummaryWorkspaceService;
  let repository: RataSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        RataSummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: RataSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataSummaryMap,
          useFactory: mockMap,
        },
        {
          provide: RataRunWorkspaceService,
          useFactory: mockRataRunService,
        },
        {
          provide: RataSummaryRepository,
          useFactory: mockOfficialRepository,
        },
      ],
    }).compile();

    service = module.get<RataSummaryWorkspaceService>(
      RataSummaryWorkspaceService,
    );
    repository = module.get<RataSummaryWorkspaceRepository>(
      RataSummaryWorkspaceRepository,
    );
  });

  describe('createRataSummary', () => {
    it('calls the repository.create() and insert a rata-summary record', async () => {
      const result = await service.createRataSummary(
        testSumId,
        rataId,
        payload,
        userId,
      );
      expect(result).toEqual(record);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('updateRataSummary', () => {
    it('should update a rata summary record', async () => {
      const result = await service.updateRataSummary(
        testSumId,
        rataId,
        payload,
        userId,
      );
      expect(result).toEqual(record);
    });

    it('should throw error with invalid rata summary record id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateRataSummary(testSumId, rataId, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteRataSummary', () => {
    it('Should delete a Rata Summary record', async () => {
      const result = await service.deleteRataSummary(testSumId, rataId, userId);
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Rata Summary record', async () => {
      const error = new LoggingException(
        `Error deleting Rata Summary with record Id [${rataId}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteRataSummary(testSumId, rataId, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getRataSummariesByRataIds', () => {
    it('Should get Rata Summary records by rata ids', async () => {
      const result = await service.getRataSummariesByRataIds([rataId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata Summary', async () => {
      jest.spyOn(service, 'getRataSummariesByRataIds').mockResolvedValue([dto]);
      const result = await service.export([rataId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('import', () => {
    const importPayload = new RataSummaryImportDTO();
    importPayload.rataRunData = [new RataRunImportDTO()];

    it('Should import Rata Summary', async () => {
      jest.spyOn(service, 'createRataSummary').mockResolvedValue(dto);
      const result = await service.import(
        testSumId,
        rataId,
        importPayload,
        userId,
      );
      expect(result).toEqual(null);
    });

    it('Should import Rata Summary with historical data', async () => {
      jest.spyOn(service, 'createRataSummary').mockResolvedValue(dto);
      const result = await service.import(
        testSumId,
        rataId,
        importPayload,
        userId,
        true,
      );
      expect(result).toEqual(null);
    });
  });
});
