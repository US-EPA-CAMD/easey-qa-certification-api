import { Test, TestingModule } from '@nestjs/testing';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunWorkspaceRepository } from './rata-run.repository';
import { RataRunWorkspaceService } from './rata-run.service';
import { RataRun } from '../entities/rata-run.entity';
import { RataRunDTO } from '../dto/rata-run.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

const testSumId = 'testsumid';
const rataRunId = 'ratarunid';
const rataSumId = 'ratasumid';
const userId = 'userid';
const rataRun = new RataRun();
const rataRunDTO = new RataRunDTO();

const payload: RataRunDTO = {
  id: 'a1b2c3',
  rataSumId: 'd4e5f6',
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
  runStatusCode: '',
  flowRataRunData: [],
  calculatedRataReferenceValue: 0,
  userId: '',
  addDate: '',
  updateDate: '',
};

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataRunDTO),
  many: jest.fn().mockResolvedValue([rataRunDTO]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([rataRun]),
  findOne: jest.fn().mockResolvedValue(rataRun),
  create: jest.fn().mockResolvedValue(rataRun),
  save: jest.fn().mockResolvedValue(rataRun),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
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
});
