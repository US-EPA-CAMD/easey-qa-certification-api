import { Test, TestingModule } from '@nestjs/testing';
import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

const testSumId = '';
const userId = 'user';
const entity = new FuelFlowToLoadTest();
const fuelFlowToLoadTestRecord = new FuelFlowToLoadTestDTO();
const fuelFlowToLoadTests = [fuelFlowToLoadTestRecord];

const payload = new FuelFlowToLoadTestBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(fuelFlowToLoadTestRecord),
  many: jest.fn().mockResolvedValue(fuelFlowToLoadTests),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('FuelFlowToLoadTestWorkspaceService', () => {
  let service: FuelFlowToLoadTestWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelFlowToLoadTestWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FuelFlowToLoadTestWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowToLoadTestMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FuelFlowToLoadTestWorkspaceService>(
      FuelFlowToLoadTestWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
  });

  describe('createFuelFlowToLoadTest', () => {
    it('Should create and return a new Fuel Flow To Load Test record', async () => {
      const result = await service.createFuelFlowToLoadTest(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(fuelFlowToLoadTestRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });
});
