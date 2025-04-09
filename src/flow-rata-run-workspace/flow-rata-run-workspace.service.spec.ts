import {ConfigService} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {Logger} from '@us-epa-camd/easey-common/logger';
import {EntityManager} from 'typeorm';
import {settlePromises} from '../utilities/constants';

import {
  FlowRataRunBaseDTO,
  FlowRataRunDTO,
  FlowRataRunImportDTO,
} from '../dto/flow-rata-run.dto';
import {
  RataTraverseDTO,
  RataTraverseImportDTO,
} from '../dto/rata-traverse.dto';
import {FlowRataRun as FlowRataRunOfficial} from '../entities/flow-rata-run.entity';
import {FlowRataRun} from '../entities/workspace/flow-rata-run.entity';
import {FlowRataRunRepository} from '../flow-rata-run/flow-rata-run.repository';
import {FlowRataRunMap} from '../maps/flow-rata-run.map';
import {RataTraverseWorkspaceService} from '../rata-traverse-workspace/rata-traverse-workspace.service';
import {TestSummaryWorkspaceService} from '../test-summary-workspace/test-summary.service';
import {FlowRataRunWorkspaceRepository} from './flow-rata-run-workspace.repository';
import {FlowRataRunWorkspaceService} from './flow-rata-run-workspace.service';

const flowRataRunId = 'a1b2c3';
const testSumId = 'd4e5f6';
const rataRunId = 'd4e5f6';
const flowRataRun = new FlowRataRun();
const flowRataRunDTO = new FlowRataRunDTO();
const userId = 'testUser';

const payload: FlowRataRunBaseDTO = {
  numberOfTraversePoints: 1,
  barometricPressure: 2,
  staticStackPressure: 3,
  percentCO2: 4,
  percentO2: 5,
  percentMoisture: 6,
  dryMolecularWeight: 7,
  wetMolecularWeight: 8,
  averageVelocityWithoutWallEffects: 9,
  averageVelocityWithWallEffects: 10,
  calculatedWAF: 11,
  averageStackFlowRate: 12,
};

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowRataRunDTO),
  many: jest.fn().mockResolvedValue([flowRataRunDTO]),
});

const mockRepository = () => ({
  save: jest.fn().mockResolvedValue(flowRataRun),
  find: jest.fn().mockResolvedValue([flowRataRun]),
  findOneBy: jest.fn().mockResolvedValue(flowRataRun),
  create: jest.fn().mockResolvedValue(flowRataRun),
});

const mockRataTraverseService = () => ({
  export: jest.fn().mockResolvedValue([new RataTraverseDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const officialRecord = new FlowRataRunOfficial();
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

describe('FlowRataRunWorkspaceService', () => {
  let service: FlowRataRunWorkspaceService;
  let repository: FlowRataRunWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;
  let officialRepository: FlowRataRunRepository;
  let rataTraverseService: RataTraverseWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        FlowRataRunWorkspaceService,
        ConfigService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: FlowRataRunWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataTraverseWorkspaceService,
          useFactory: mockRataTraverseService,
        },
        {
          provide: FlowRataRunMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FlowRataRunRepository,
          useFactory: mockOfficialRepository,
        },
      ],
    }).compile();

    service = module.get<FlowRataRunWorkspaceService>(
      FlowRataRunWorkspaceService,
    );
    repository = module.get<FlowRataRunWorkspaceRepository>(
      FlowRataRunWorkspaceRepository,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    officialRepository = module.get<FlowRataRunRepository>(
      FlowRataRunRepository,
    );
    rataTraverseService = module.get<RataTraverseWorkspaceService>(
      RataTraverseWorkspaceService,
    );
  });

  describe('getFlowRataRun', () => {
    it('Calls repository.findOneBy({id}) to get a single Flow Rata Run record', async () => {
      const result = await service.getFlowRataRun(flowRataRunId);
      expect(result).toEqual(flowRataRunDTO);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Flow Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getFlowRataRun(flowRataRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getFlowRataRuns', () => {
    it('Should return an array of Flow Rata Run records', async () => {
      const result = await service.getFlowRataRuns(flowRataRunId);
      expect(result).toEqual([flowRataRun]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createFlowRataRun', () => {
    it('Should create and return a new Flow Rata Run record', async () => {
      const result = await service.createFlowRataRun(
        testSumId,
        rataRunId,
        payload,
        userId,
      );

      expect(result).toEqual(flowRataRun);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
    it('Should create and return a new Rata Run record with historical record id', async () => {
      const result = await service.createFlowRataRun(
        testSumId,
        rataRunId,
        payload,
        userId,
        true,
      );

      expect(result).toEqual(flowRataRun);
    });
  });

  describe('getRataSummariesByRataIds', () => {
    it('Should get Rata Travarse records by flow rata run ids', async () => {
      const result = await service.getFlowRataRunsByRataRunIds([rataRunId]);
      expect(result).toEqual([flowRataRunDTO]);
    });
  });

  describe('import', () => {
    const importPayload = new FlowRataRunImportDTO();

    it('Should import Flow Rata Run', async () => {
      jest
        .spyOn(service, 'createFlowRataRun')
        .mockResolvedValue(flowRataRunDTO);
      const result = await service.import(
        testSumId,
        rataRunId,
        importPayload,
        userId,
      );
      expect(result).toEqual(null);
    });

    it('Should import Flow Rata Run with historical data', async () => {
      importPayload.rataTraverseData = [new RataTraverseImportDTO()];
      jest
        .spyOn(service, 'createFlowRataRun')
        .mockResolvedValue(flowRataRunDTO);
      jest
        .spyOn(officialRepository, 'findOneBy')
        .mockResolvedValue(officialRecord);
      const result = await service.import(
        testSumId,
        rataRunId,
        importPayload,
        userId,
        true,
      );
      expect(result).toEqual(null);
    });

    it('Should import Flow Rata Run with transaction', async () => {
      // Create a spy on createFlowRataRun that returns the expected value
      const createFlowRataRunSpy = jest
        .spyOn(service, 'createFlowRataRun')
        .mockResolvedValue(flowRataRunDTO);

      // Mock transaction for entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      // Call import with transaction
      await service.import(
        testSumId,
        rataRunId,
        importPayload,
        userId,
        false,
        mockTrx,
      );

      // Verify createFlowRataRun was called with transaction
      expect(createFlowRataRunSpy).toHaveBeenCalledWith(
        testSumId,
        rataRunId,
        expect.any(Object),
        userId,
        true,
        null,
        mockTrx,
      );
    });

    it('Should use settlePromises instead of Promise.all', async () => {
      // Create payload with rata traverse data
      const importPayloadWithTraverseData = new FlowRataRunImportDTO();
      importPayloadWithTraverseData.rataTraverseData = [new RataTraverseImportDTO()];

      // Spy on settlePromises
      const settlePromisesSpy = jest.spyOn(require('../utilities/constants'), 'settlePromises');

      // Call import with rataTraverseData
      await service.import(testSumId, rataRunId, importPayloadWithTraverseData, userId);

      // Verify settlePromises was called
      expect(settlePromisesSpy).toHaveBeenCalled();
    });
  });

  describe('Export', () => {
    it('Should Export Rata Run', async () => {
      jest
        .spyOn(service, 'getFlowRataRunsByRataRunIds')
        .mockResolvedValue([flowRataRunDTO]);
      const result = await service.export([rataRunId]);
      expect(result).toEqual([flowRataRunDTO]);
    });
  });

  describe('Transaction Support', () => {
    it('Should use transaction entity manager when provided', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue(flowRataRun),
          save: jest.fn().mockResolvedValue(flowRataRun),
          findOneBy: jest.fn().mockResolvedValue(flowRataRun),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call createFlowRataRun with transaction
      await service.createFlowRataRun(
        testSumId,
        rataRunId,
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

      // Create a spy on createFlowRataRun that returns a known value with ID
      const mockFlowRataRun = new FlowRataRunDTO();
      mockFlowRataRun.id = 'test-flow-run-id';
      jest.spyOn(service, 'createFlowRataRun').mockResolvedValue(mockFlowRataRun);

      // Spy on rataTraverseService.import
      const traverseImportSpy = jest.spyOn(rataTraverseService, 'import');

      // Create payload with rata traverse data
      const importPayloadWithTraverseData = new FlowRataRunImportDTO();
      importPayloadWithTraverseData.rataTraverseData = [new RataTraverseImportDTO()];

      // Call import with transaction
      await service.import(
        testSumId,
        rataRunId,
        importPayloadWithTraverseData,
        userId,
        false,
        mockTrx,
      );

      // Verify transaction was passed to child service with the correct parameters
      expect(traverseImportSpy).toHaveBeenCalledWith(
        testSumId,
        mockFlowRataRun.id,
        expect.any(Object),
        userId,
        false,
        mockTrx,
      );
    });
  });
});
