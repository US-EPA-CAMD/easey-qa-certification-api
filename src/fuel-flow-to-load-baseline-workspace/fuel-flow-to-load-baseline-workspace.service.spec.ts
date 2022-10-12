import { Test, TestingModule } from '@nestjs/testing';
import {
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaseline } from '../entities/workspace/fuel-flow-to-load-baseline.entity';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadBaselineWorkspaceRepository } from './fuel-flow-to-load-baseline-workspace.repository';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

const testSumId = '';
const userId = 'user';
const entity = new FuelFlowToLoadBaseline();
const dto = new FuelFlowToLoadBaselineDTO();

const payload = new FuelFlowToLoadBaselineBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('FuelFlowToLoadBaselineWorkspaceService', () => {
  let service: FuelFlowToLoadBaselineWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: FuelFlowToLoadBaselineWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelFlowToLoadBaselineWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FuelFlowToLoadBaselineWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowToLoadBaselineMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FuelFlowToLoadBaselineWorkspaceService>(
      FuelFlowToLoadBaselineWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<FuelFlowToLoadBaselineWorkspaceRepository>(
      FuelFlowToLoadBaselineWorkspaceRepository,
    );
  });

  describe('createFuelFlowToLoadBaseline', () => {
    it('Should create and return a new Fuel Flow To Load Baseline record', async () => {
      const result = await service.createFuelFlowToLoadBaseline(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });
});
