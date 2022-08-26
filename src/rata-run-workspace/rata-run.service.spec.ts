import { Test, TestingModule } from '@nestjs/testing';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunWorkspaceRepository } from './rata-run.repository';
import { RataRunWorkspaceService } from './rata-run.service';
import { RataRun } from '../entities/rata-run.entity';
import { RataRunBaseDTO, RataRunDTO } from '../dto/rata-run.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

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

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataRunDTO),
  many: jest.fn().mockResolvedValue([rataRunDTO]),
});

const mockRepository = () => ({
  save: jest.fn().mockResolvedValue(rataRun),
  find: jest.fn().mockResolvedValue([rataRun]),
  findOne: jest.fn().mockResolvedValue(rataRun),
  create: jest.fn().mockResolvedValue(rataRun),
});

describe('RataRunWorkspaceService', () => {
  let service: RataRunWorkspaceService;
  let repository: RataRunWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataRunWorkspaceService,
        RataRunMap,
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
      ],
    }).compile();

    service = module.get<RataRunWorkspaceService>(RataRunWorkspaceService);
    repository = module.get<RataRunWorkspaceRepository>(
      RataRunWorkspaceRepository,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
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
});
