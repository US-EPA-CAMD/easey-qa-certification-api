import { Test, TestingModule } from '@nestjs/testing';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';
import { FlowRataRun } from '../entities/flow-rata-run.entity';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';

const flowRataRunId = 'a1b2c3';
const RataRunId = 'd4e5f6';
const flowRataRun = new FlowRataRun();
const flowRataRunDTO = new FlowRataRunDTO();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowRataRunDTO),
  many: jest.fn().mockResolvedValue([flowRataRunDTO]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([flowRataRun]),
  findOne: jest.fn().mockResolvedValue(flowRataRun),
});

describe('FlowRataRunWorkspaceService', () => {
  let service: FlowRataRunWorkspaceService;
  let repository: FlowRataRunWorkspaceRepository;

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
      ],
    }).compile();

    service = module.get<FlowRataRunWorkspaceService>(FlowRataRunWorkspaceService);
    repository = module.get<FlowRataRunWorkspaceRepository>(FlowRataRunWorkspaceRepository);
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
      const result = await service.getFlowRataRuns(RataRunId);
      expect(result).toEqual([flowRataRun]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
