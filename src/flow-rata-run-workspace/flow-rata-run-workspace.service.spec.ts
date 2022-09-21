import { Test, TestingModule } from '@nestjs/testing';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';
import { FlowRataRun } from '../entities/flow-rata-run.entity';
import { FlowRataRunBaseDTO, FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

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
  findOne: jest.fn().mockResolvedValue(flowRataRun),
  create: jest.fn().mockResolvedValue(flowRataRun),
});

describe('FlowRataRunWorkspaceService', () => {
  let service: FlowRataRunWorkspaceService;
  let repository: FlowRataRunWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowRataRunWorkspaceService,
        FlowRataRunMap,
        {
          provide: FlowRataRunWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FlowRataRunMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
      ],
    }).compile();

    service = module.get<FlowRataRunWorkspaceService>(FlowRataRunWorkspaceService);
    repository = module.get<FlowRataRunWorkspaceRepository>(FlowRataRunWorkspaceRepository,);
    testSummaryService = module.get<TestSummaryWorkspaceService>(TestSummaryWorkspaceService,);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFlowRataRun', () => {
    it('Calls repository.findOne({id}) to get a single Flow Rata Run record', async () => {
      const result = await service.getFlowRataRun(flowRataRunId);
      expect(result).toEqual(flowRataRunDTO);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Flow Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

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
      expect(repository.findOne).toHaveBeenCalled();
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
});
