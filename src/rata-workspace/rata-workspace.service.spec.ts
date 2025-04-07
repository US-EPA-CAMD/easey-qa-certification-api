import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';
import { settlePromises } from '../utilities/constants';

import { RataSummaryDTO, RataSummaryImportDTO } from '../dto/rata-summary.dto';
import {
  RataBaseDTO,
  RataDTO,
  RataImportDTO,
  RataRecordDTO,
} from '../dto/rata.dto';
import { Rata as RataOfficial } from '../entities/rata.entity';
import { Rata } from '../entities/workspace/rata.entity';
import { RataMap } from '../maps/rata.map';
import { RataSummaryWorkspaceService } from '../rata-summary-workspace/rata-summary-workspace.service';
import { RataRepository } from '../rata/rata.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataWorkspaceService } from './rata-workspace.service';

const rataDto = new RataDTO();

const locId = '';
const testSumId = '';
const rataId = '';
const userId = 'testUser';
const rataEntity = new Rata();
rataEntity.id = 'uuid';
const rataRecord = new RataRecordDTO();

const payload: RataBaseDTO = {
  rataFrequencyCode: 'OS',
  relativeAccuracy: 0,
  overallBiasAdjustmentFactor: 0,
  numberOfLoadLevels: 0,
};

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue([rataEntity]),
  create: jest.fn().mockResolvedValue(rataEntity),
  save: jest.fn().mockResolvedValue(rataEntity),
  findOneBy: jest.fn().mockResolvedValue(rataEntity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRataSummaryService = () => ({
  export: jest.fn().mockResolvedValue([new RataSummaryDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataDto),
  many: jest.fn().mockResolvedValue([rataDto]),
});

const officialRecord = new RataOfficial();
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

describe('RataWorkspaceService', () => {
  let service: RataWorkspaceService;
  let repository: RataWorkspaceRepository;
  let officialRepository: RataRepository;
  let testSummaryService: TestSummaryWorkspaceService;
  let rataSummaryService: RataSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        RataWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: RataSummaryWorkspaceService,
          useFactory: mockRataSummaryService,
        },
        {
          provide: RataWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: RataMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataWorkspaceService>(RataWorkspaceService);
    repository = module.get<RataWorkspaceRepository>(RataWorkspaceRepository);
    officialRepository = module.get<RataRepository>(RataRepository);
    testSummaryService = module.get<TestSummaryWorkspaceService>(
        TestSummaryWorkspaceService,
    );
    rataSummaryService = module.get<RataSummaryWorkspaceService>(
        RataSummaryWorkspaceService,
    );
  });

  describe('getRataById', () => {
    it('calls the repository.findOneBy() and get one rata record', async () => {
      const result = await service.getRataById(rataId);
      expect(result).toEqual(rataRecord);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should through error while not finding a Rata record', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.getRataById(rataId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getRatasByTestSumId', () => {
    it('calls the repository.findBy() and get many rata record', async () => {
      const result = await service.getRatasByTestSumId(rataId);
      expect(result).toEqual([rataRecord]);
      expect(repository.findBy).toHaveBeenCalled();
    });
  });

  describe('createRata', () => {
    it('calls the repository.create() and insert a rata record', async () => {
      const result = await service.createRata(testSumId, payload, userId);
      expect(result).toEqual(rataRecord);
      expect(repository.create).toHaveBeenCalled();
    });
    it('calls the repository.create() and insert a rata record with historical record id', async () => {
      const result = await service.createRata(
          testSumId,
          payload,
          userId,
          true,
          'uuid',
      );
      expect(result).toEqual(rataRecord);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('updateRata', () => {
    it('should update a rata record', async () => {
      const result = await service.updateRata(
          testSumId,
          rataId,
          payload,
          userId,
      );
      expect(result).toEqual(rataRecord);
    });

    it('should throw error with invalid rata record id', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateRata(testSumId, rataId, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteRata', () => {
    it('Should delete a Rata record', async () => {
      const result = await service.deleteRata(testSumId, rataId, userId);
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Rata record', async () => {
      const error = new EaseyException(
          new Error(`Error deleting RATA with record Id [${rataId}]`),
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteRata(testSumId, rataId, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getRatasByTestSumIds', () => {
    it('Should get Rata records by test summary ids', async () => {
      const result = await service.getRatasByTestSumIds([testSumId]);
      expect(result).toEqual([rataDto]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata', async () => {
      jest.spyOn(service, 'getRatasByTestSumIds').mockResolvedValue([rataDto]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([rataDto]);
    });
  });

  describe('import', () => {
    const importPayload = new RataImportDTO();

    it('Should import Rata', async () => {
      jest.spyOn(service, 'createRata').mockResolvedValue(rataDto);
      const result = await service.import(testSumId, importPayload, userId);
      expect(result).toEqual(null);
    });

    it('Should import Rata with historical data', async () => {
      const rataSummary = new RataSummaryImportDTO();
      rataSummary.apsCode = '';
      importPayload.rataSummaryData = [rataSummary];

      jest.spyOn(service, 'createRata').mockResolvedValue(rataDto);
      jest
          .spyOn(officialRepository, 'findOneBy')
          .mockResolvedValue(officialRecord);
      const result = await service.import(
          testSumId,
          importPayload,
          userId,
          true,
      );
      expect(result).toEqual(null);
    });

    it('Should import Rata with transaction', async () => {
      jest.spyOn(service, 'createRata').mockResolvedValue(rataDto);

      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      await service.import(testSumId, importPayload, userId, false, mockTrx);

      // Verify createRata was called with transaction
      // Update the expectation to match the actual parameter order and types
      expect(service.createRata).toHaveBeenCalledWith(
          testSumId,
          expect.any(Object),
          userId,
          expect.any(Boolean),
        null, // Use null instead of expect.any(String) for historicalRecordId
          mockTrx,
      );
    });

    it('Should use settlePromises instead of Promise.all', async () => {
      // Create payload with summary data
      const importPayloadWithSummaries = new RataImportDTO();
      importPayloadWithSummaries.rataSummaryData = [new RataSummaryImportDTO()];

      // Spy on settlePromises
      const settlePromisesSpy = jest.spyOn(require('../utilities/constants'), 'settlePromises');

      // Call import with rataSummaryData
      await service.import(testSumId, importPayloadWithSummaries, userId);

      // Verify settlePromises was called
      expect(settlePromisesSpy).toHaveBeenCalled();
    });
  });

  describe('Transaction Support', () => {
    it('Should use transaction entity manager when provided', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue(rataEntity),
          save: jest.fn().mockResolvedValue(rataEntity),
          findOneBy: jest.fn().mockResolvedValue(rataEntity),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call createRata with transaction
      await service.createRata(
          testSumId,
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

      // Spy on rataSummaryService.import
      const summaryImportSpy = jest.spyOn(rataSummaryService, 'import');

      // Create payload with summary data
      const importPayloadWithSummaries = new RataImportDTO();
      importPayloadWithSummaries.rataSummaryData = [new RataSummaryImportDTO()];

      // Call import with transaction
      await service.import(
          testSumId,
          importPayloadWithSummaries,
          userId,
          false,
          mockTrx,
      );

      // Verify transaction was passed to child service
      expect(summaryImportSpy).toHaveBeenCalledWith(
          expect.any(String),
        undefined,
          expect.any(Object),
          expect.any(String),
          expect.any(Boolean),
          mockTrx,
      );
    });

    it('Should use transaction entity manager for update operations', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          findOneBy: jest.fn().mockResolvedValue(rataEntity),
          save: jest.fn().mockResolvedValue(rataEntity),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call updateRata with transaction
      await service.updateRata(
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

      // Call deleteRata with transaction
      await service.deleteRata(
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
