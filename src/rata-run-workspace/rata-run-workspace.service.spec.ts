import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';
import { settlePromises } from '../utilities/constants';

import { FlowRataRunDTO, FlowRataRunImportDTO } from '../dto/flow-rata-run.dto';
import {
  RataRunBaseDTO,
  RataRunDTO,
  RataRunImportDTO,
} from '../dto/rata-run.dto';
import { RataRun as RataRunOfficial } from '../entities/rata-run.entity';
import { RataRun } from '../entities/workspace/rata-run.entity';
import { FlowRataRunWorkspaceService } from '../flow-rata-run-workspace/flow-rata-run-workspace.service';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunRepository } from '../rata-run/rata-run.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { RataRunWorkspaceService } from './rata-run-workspace.service';

const rataRunId = 'a1b2c3';
const testSumId = 'd4e5f6';
const rataSumId = 'd4e5f6';
const userId = 'testUser';
const rataRun = new RataRun();
const rataRunDTO = new RataRunDTO();

const payload: RataRunBaseDTO = {
  runNumber: 1,
  beginDate: new Date(),
  beginHour: 12,
  beginMinute: 30,
  endDate: new Date(),
  endHour: 18,
  endMinute: 15,
  cemValue: 13,
  rataReferenceValue: 11,
  grossUnitLoad: 7,
  runStatusCode: 'NOTUSED',
};

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockFlowRataRunService = () => ({
  export: jest.fn().mockResolvedValue([new FlowRataRunDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataRunDTO),
  many: jest.fn().mockResolvedValue([rataRunDTO]),
});

const mockRepository = () => ({
  save: jest.fn().mockResolvedValue(rataRun),
  find: jest.fn().mockResolvedValue([rataRun]),
  findOneBy: jest.fn().mockResolvedValue(rataRun),
  create: jest.fn().mockResolvedValue(rataRun),
  delete: jest.fn().mockReturnValue(''),
});

const officialRecord = new RataRunOfficial();
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

describe('RataRunWorkspaceService', () => {
  let service: RataRunWorkspaceService;
  let repository: RataRunWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;
  let officialRepository: RataRunRepository;
  let flowRataRunService: FlowRataRunWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        RataRunWorkspaceService,
        {
          provide: RataRunWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataRunMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FlowRataRunWorkspaceService,
          useFactory: mockFlowRataRunService,
        },
        {
          provide: RataRunRepository,
          useFactory: mockOfficialRepository,
        },
      ],
    }).compile();

    service = module.get<RataRunWorkspaceService>(RataRunWorkspaceService);
    repository = module.get<RataRunWorkspaceRepository>(
      RataRunWorkspaceRepository,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    officialRepository = module.get<RataRunRepository>(RataRunRepository);
    flowRataRunService = module.get<FlowRataRunWorkspaceService>(
      FlowRataRunWorkspaceService,
    );
  });

  describe('getRataRun', () => {
    it('Calls repository.findOneBy({id}) to get a single Rata Run record', async () => {
      const result = await service.getRataRun(rataRunId);
      expect(result).toEqual(rataRunDTO);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getRataRun(rataRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getRataRuns', () => {
    it('Should return an array of Rata Run records', async () => {
      const result = await service.getRataRuns(rataSumId);
      expect(result).toEqual([rataRun]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createRataRun', () => {
    it('Should create and return a new Rata Run record', async () => {
      const result = await service.createRataRun(
        testSumId,
        rataSumId,
        payload,
        userId,
      );

      expect(result).toEqual(rataRun);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
    it('Should create and return a new Rata Run record with historical record id', async () => {
      const result = await service.createRataRun(
        testSumId,
        rataSumId,
        payload,
        userId,
        true,
        'uuid',
      );

      expect(result).toEqual(rataRun);
    });
  });

  describe('deleteRataRun', () => {
    it('Should return an array of Rata Run records', async () => {
      const result = await service.deleteRataRun(testSumId, rataRunId, userId);
      expect(repository.delete).toHaveBeenCalled();
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('updateRataRun', () => {
    it('should update a rata run record', async () => {
      const result = await service.updateRataRun(
        testSumId,
        rataRunId,
        payload,
        userId,
      );
      expect(result).toEqual(rataRunDTO);
    });

    it('should throw error with invalid rata run record id', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateRataRun(testSumId, rataRunId, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getRataRunsByRataSumIds', () => {
    it('Should get Rata Run records by rata summary ids', async () => {
      const result = await service.getRataRunsByRataSumIds([rataSumId]);
      expect(result).toEqual([rataRunDTO]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata Run', async () => {
      jest
        .spyOn(service, 'getRataRunsByRataSumIds')
        .mockResolvedValue([rataRunDTO]);
      const result = await service.export([rataSumId]);
      expect(result).toEqual([rataRunDTO]);
    });
  });

  describe('import', () => {
    const importPayload = new RataRunImportDTO();

    it('Should import Rata Run', async () => {
      jest.spyOn(service, 'createRataRun').mockResolvedValue(rataRunDTO);
      const result = await service.import(
        testSumId,
        rataSumId,
        importPayload,
        userId,
      );
      expect(result).toEqual(null);
    });

    it('Should import Rata with historical data', async () => {
      importPayload.flowRataRunData = [new FlowRataRunImportDTO()];
      jest.spyOn(service, 'createRataRun').mockResolvedValue(rataRunDTO);
      jest
        .spyOn(officialRepository, 'findOneBy')
        .mockResolvedValue(officialRecord);
      const result = await service.import(
        testSumId,
        rataSumId,
        importPayload,
        userId,
        true,
      );
      expect(result).toEqual(null);
    });

    it('Should import Rata Run with transaction', async () => {
      // Create a spy on createRataRun that returns the expected value
      const createRataRunSpy = jest
        .spyOn(service, 'createRataRun')
        .mockResolvedValue(rataRunDTO);

      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      // Call import with transaction
      await service.import(
        testSumId,
        rataSumId,
        importPayload,
        userId,
        false,
        mockTrx,
      );

      // Verify createRataRun was called with transaction
      expect(createRataRunSpy).toHaveBeenCalledWith(
        testSumId,
        rataSumId,
        expect.any(Object),
        userId,
        true, // isImport is always true in the import method
        null, // historicalRecordId is null when not a historical record
        mockTrx,
      );
    });

    it('Should use settlePromises instead of Promise.all', async () => {
      // Create payload with flow rata run data
      const importPayloadWithFlowData = new RataRunImportDTO();
      importPayloadWithFlowData.flowRataRunData = [new FlowRataRunImportDTO()];

      // Spy on settlePromises
      const settlePromisesSpy = jest.spyOn(require('../utilities/constants'), 'settlePromises');

      // Call import with flowRataRunData
      await service.import(testSumId, rataSumId, importPayloadWithFlowData, userId);

      // Verify settlePromises was called
      expect(settlePromisesSpy).toHaveBeenCalled();
    });
  });

  describe('Transaction Support', () => {
    it('Should use transaction entity manager when provided', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue(rataRun),
          save: jest.fn().mockResolvedValue(rataRun),
          findOneBy: jest.fn().mockResolvedValue(rataRun),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call createRataRun with transaction
      await service.createRataRun(
        testSumId,
        rataSumId,
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

      // Create a spy on createRataRun that returns a known value with ID
      const mockRataRun = new RataRunDTO();
      mockRataRun.id = 'test-run-id';
      jest.spyOn(service, 'createRataRun').mockResolvedValue(mockRataRun);

      // Spy on flowRataRunService.import
      const flowImportSpy = jest.spyOn(flowRataRunService, 'import');

      // Create payload with flow rata run data
      const importPayloadWithFlowData = new RataRunImportDTO();
      importPayloadWithFlowData.flowRataRunData = [new FlowRataRunImportDTO()];

      // Call import with transaction
      await service.import(
        testSumId,
        rataSumId,
        importPayloadWithFlowData,
        userId,
        false,
        mockTrx,
      );

      // Verify transaction was passed to child service with the correct parameters
      expect(flowImportSpy).toHaveBeenCalledWith(
        testSumId,
        mockRataRun.id,
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
          findOneBy: jest.fn().mockResolvedValue(rataRun),
          save: jest.fn().mockResolvedValue(rataRun),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call updateRataRun with transaction
      await service.updateRataRun(
        testSumId,
        rataRunId,
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

      // Call deleteRataRun with transaction
      await service.deleteRataRun(
        testSumId,
        rataRunId,
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
