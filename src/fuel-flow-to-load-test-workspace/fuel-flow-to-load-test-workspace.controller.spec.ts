import { Test, TestingModule } from '@nestjs/testing';
import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestWorkspaceController } from './fuel-flow-to-load-test-workspace.controller';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

const locId = '';
const testSumId = '';
const testQualificationId = 'g7h8i9';
const testUser = 'testUser';

const fuelFlowToLoadTest = new FuelFlowToLoadTestDTO();
const fuelFlowToLoadTests = [fuelFlowToLoadTest];

const mockService = () => ({
  createFuelFlowToLoadTest: jest.fn().mockResolvedValue(fuelFlowToLoadTest),
});

const payload = new FuelFlowToLoadTestBaseDTO();

describe('FuelFlowToLoadTestWorkspaceController', () => {
  let controller: FuelFlowToLoadTestWorkspaceController;
  let service: FuelFlowToLoadTestWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelFlowToLoadTestWorkspaceController],
      providers: [
        {
          provide: FuelFlowToLoadTestWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FuelFlowToLoadTestWorkspaceController>(
      FuelFlowToLoadTestWorkspaceController,
    );
  });

  describe('createFuelFlowToLoadTest', () => {
    it('Calls the service to create a new fuel Flow To Load Test record', async () => {
      const result = await controller.createFuelFlowToLoadTest(
        locId,
        testSumId,
        payload,
      );
      expect(result).toEqual(fuelFlowToLoadTest);
    });
  });
});
