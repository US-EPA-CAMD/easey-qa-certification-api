import { Test, TestingModule } from '@nestjs/testing';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { FlowRataRunWorkspaceController } from './flow-rata-run-workspace.controller';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const rataId = 'g7h8i9';
const rataSumId = 'j0k1l2';
const rataRunId = 'm3n4o5';
const flowRataRunId = 'p6q7r8';

const flowRataRunDTO: FlowRataRunDTO = new FlowRataRunDTO();
const flowRataRuns: FlowRataRunDTO[] = [flowRataRunDTO];

const mockFlowRataRunService = () => ({
  getFlowRataRun: jest.fn().mockResolvedValue(flowRataRunDTO),
  getFlowRataRuns: jest.fn().mockResolvedValue(flowRataRuns),
});

describe('FlowRataRunWorkspaceController', () => {
  let controller: FlowRataRunWorkspaceController;
  let service: FlowRataRunWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowRataRunWorkspaceController],
      providers: [
        {
          provide: FlowRataRunWorkspaceService,
          useFactory: mockFlowRataRunService,
        },
      ],
    }).compile();

    controller = module.get<FlowRataRunWorkspaceController>(FlowRataRunWorkspaceController);
    service = module.get<FlowRataRunWorkspaceService>(FlowRataRunWorkspaceService);
  });

  describe('getFlowRataRun', () => {
    it('Calls the repository to get one Flow Rata Run record by Id', async () => {
      const result = await controller.getFlowRataRun(
        locId,
        testSumId,
        rataId,
        rataSumId,
        rataRunId,
        flowRataRunId,
      );
      expect(result).toEqual(flowRataRunDTO);
      expect(service.getFlowRataRun).toHaveBeenCalled();
    });
  });

  describe('getFlowRataRuns', () => {
    it('Calls the repository to get all Flow Rata Run records for a Flow Rata Summary Id', async () => {
      const result = await controller.getFlowRataRuns(
        locId,
        testSumId,
        rataId,
        rataSumId,
        rataRunId,
      );
      expect(result).toEqual(flowRataRuns);
      expect(service.getFlowRataRuns).toHaveBeenCalled();
    });
  });
});
