import { Test, TestingModule } from '@nestjs/testing';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { RataRunWorkspaceService } from './rata-run-workspace.service';
import { RataRun } from '../entities/workspace/rata-run.entity';
import { RataRun as RataRunOfficial } from '../entities/rata-run.entity';
import {
  RataRunBaseDTO,
  RataRunDTO,
  RataRunImportDTO,
} from '../dto/rata-run.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { RataRunRepository } from '../rata-run/rata-run.repository';
import { FlowRataRunWorkspaceService } from '../flow-rata-run-workspace/flow-rata-run-workspace.service';
import { FlowRataRunDTO, FlowRataRunImportDTO } from '../dto/flow-rata-run.dto';

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
  findOne: jest.fn().mockResolvedValue(rataRun),
  create: jest.fn().mockResolvedValue(rataRun),
  delete: jest.fn().mockReturnValue(''),
});

const officialRecord = new RataRunOfficial();
officialRecord.id = 'uuid';
const mockOfficialRepository = () => ({
  findOne: jest.fn(),
});

describe('RataRunWorkspaceService', () => {
  let service: RataRunWorkspaceService;
  let repository: RataRunWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;
  let officialRepository: RataRunRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
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
  });

  describe('getRataRun', () => {
    it('Calls repository.findOne({id}) to get a single Rata Run record', async () => {
      const result = await service.getRataRun(rataRunId);
      expect(result).toEqual(rataRunDTO);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

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
      expect(repository.findOne).toHaveBeenCalled();
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
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

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
        .spyOn(officialRepository, 'findOne')
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
  });
});
