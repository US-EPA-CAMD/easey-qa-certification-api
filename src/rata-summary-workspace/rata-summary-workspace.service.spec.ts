import {HttpStatus} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {EaseyException} from '@us-epa-camd/easey-common/exceptions';
import {Logger} from '@us-epa-camd/easey-common/logger';
import {EntityManager} from 'typeorm';
import {settlePromises} from '../utilities/constants';

import {RataRunDTO, RataRunImportDTO} from '../dto/rata-run.dto';
import {
  RataSummaryBaseDTO,
  RataSummaryDTO,
  RataSummaryImportDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import {RataSummary as RataSummaryOfficial} from '../entities/rata-summary.entity';
import {RataSummary} from '../entities/workspace/rata-summary.entity';
import {Rata} from '../entities/workspace/rata.entity';
import {TestSummary} from '../entities/workspace/test-summary.entity';
import {RataSummaryMap} from '../maps/rata-summary.map';
import {RataRunWorkspaceService} from '../rata-run-workspace/rata-run-workspace.service';
import {RataSummaryRepository} from '../rata-summary/rata-summary.repository';
import {RataWorkspaceService} from '../rata-workspace/rata-workspace.service';
import {TestSummaryWorkspaceService} from '../test-summary-workspace/test-summary.service';
import {RataSummaryWorkspaceRepository} from './rata-summary-workspace.repository';
import {RataSummaryWorkspaceService} from './rata-summary-workspace.service';

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
  findOneBy: jest.fn().mockResolvedValue(entity),
  find: jest.fn().mockResolvedValue([entity]),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
});

const mockRataService = () => ({
  getRataById: jest.fn().mockResolvedValue(new Rata()),
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
  findOneBy: jest.fn(),
});

// Mock settlePromises
jest.mock('../utilities/constants', () => ({
  settlePromises: jest.fn().mockImplementation(async (promises) => {
    return Promise.all(promises);
  }),
}));

describe('RataSummaryWorkspaceService', () => {
  let service: RataSummaryWorkspaceService;
  let repository: RataSummaryWorkspaceRepository;
  let officialRepository: RataSummaryRepository;
  let testSummaryService: TestSummaryWorkspaceService;
  let rataRunService: RataRunWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        RataSummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: RataWorkspaceService,
          useFactory: mockRataService,
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
    officialRepository = module.get<RataSummaryRepository>(
      RataSummaryRepository,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    rataRunService = module.get<RataRunWorkspaceService>(
      RataRunWorkspaceService,
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

    it('calls the repository.create() and insert a rata-summary record with historical record id', async () => {
      const result = await service.createRataSummary(
        testSumId,
        rataId,
        payload,
        userId,
        true,
        'uuid',
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
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

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
      const error = new EaseyException(
        new Error(`Error deleting Rata Summary with record Id [${rataId}]`),
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
      jest
        .spyOn(officialRepository, 'findOneBy')
        .mockResolvedValue(officialRecord);
      const result = await service.import(
        testSumId,
        rataId,
        importPayload,
        userId,
        true,
      );
      expect(result).toEqual(null);
    });

    it('Should import Rata Summary with transaction', async () => {
      // Create a spy on createRataSummary that returns the expected value
      const createRataSummarySpy = jest
        .spyOn(service, 'createRataSummary')
        .mockResolvedValue(dto);

      // Mock transaction for entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      // Call import with transaction
      await service.import(
        testSumId,
        rataId,
        importPayload,
        userId,
        false,
        mockTrx,
      );

      // Verify createRataSummary was called with transaction
      expect(createRataSummarySpy).toHaveBeenCalledWith(
        testSumId,
        rataId,
        expect.any(Object),
        userId,
        true,
        null,
        mockTrx,
      );
    });

    it('Should use settlePromises instead of Promise.all', async () => {
      // Create payload with run data
      const importPayloadWithRuns = new RataSummaryImportDTO();
      importPayloadWithRuns.rataRunData = [new RataRunImportDTO()];

      // Spy on settlePromises
      const settlePromisesSpy = jest.spyOn(require('../utilities/constants'), 'settlePromises');

      // Call import with rataRunData
      await service.import(testSumId, rataId, importPayloadWithRuns, userId);

      // Verify settlePromises was called
      expect(settlePromisesSpy).toHaveBeenCalled();
    });
  });

  describe('Transaction Support', () => {
    it('Should use transaction entity manager when provided', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue(entity),
          save: jest.fn().mockResolvedValue(entity),
          findOneBy: jest.fn().mockResolvedValue(entity),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call createRataSummary with transaction
      await service.createRataSummary(
        testSumId,
        rataId,
        payload,
        userId,
        false,
        'uuid',
        mockTrx,
      );

      // Verify transaction was used
      expect(mockTrx.getRepository).toHaveBeenCalled();

      // Verify transaction was passed to child services
      expect(resetSpy).toHaveBeenCalledWith(
        testSumId,
        userId,
        expect.any(Boolean),
        mockTrx,
      );
    });

    it('Should pass transaction to child services during import', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      // Create a spy on createRataSummary that returns a known value with ID
      const mockSummary = new RataSummaryDTO();
      mockSummary.id = 'test-summary-id';
      jest.spyOn(service, 'createRataSummary').mockResolvedValue(mockSummary);

      // Spy on rataRunService.import
      const runImportSpy = jest.spyOn(rataRunService, 'import');

      // Create payload with run data
      const importPayloadWithRuns = new RataSummaryImportDTO();
      importPayloadWithRuns.rataRunData = [new RataRunImportDTO()];

      // Call import with transaction
      await service.import(
        testSumId,
        rataId,
        importPayloadWithRuns,
        userId,
        false,
        mockTrx,
      );

      // Verify transaction was passed to child service with the correct parameters
      expect(runImportSpy).toHaveBeenCalledWith(
        testSumId,
        mockSummary.id,
        expect.any(Object),
        userId,
        false,
        mockTrx,
      );
    });

    it('Should use transaction entity manager for update operations', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          findOneBy: jest.fn().mockResolvedValue(entity),
          save: jest.fn().mockResolvedValue(entity),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call updateRataSummary with transaction
      await service.updateRataSummary(
        testSumId,
        rataId,
        payload,
        userId,
        false,
        mockTrx,
      );

      // Verify transaction was used
      expect(mockTrx.getRepository).toHaveBeenCalled();

      // Verify transaction was passed to child services
      expect(resetSpy).toHaveBeenCalledWith(
        testSumId,
        userId,
        expect.any(Boolean),
        mockTrx,
      );
    });

    it('Should use transaction entity manager for delete operations', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          delete: jest.fn().mockResolvedValue(null),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call deleteRataSummary with transaction
      await service.deleteRataSummary(
        testSumId,
        rataId,
        userId,
        false,
        mockTrx,
      );

      // Verify transaction was used
      expect(mockTrx.getRepository).toHaveBeenCalled();

      // Verify transaction was passed to child services
      expect(resetSpy).toHaveBeenCalledWith(
        testSumId,
        userId,
        expect.any(Boolean),
        mockTrx,
      );
    });
  });
});
