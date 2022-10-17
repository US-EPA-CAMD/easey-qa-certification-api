import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestWorkspaceController } from './fuel-flow-to-load-test-workspace.controller';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

const locId = '';
const testSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};
const fuelFlowToLoadTestId = 'fuelFlowToLoadTestId';
const fuelFlowToLoadTest = new FuelFlowToLoadTestDTO();
const fuelFlowToLoadTests = [fuelFlowToLoadTest];

const mockService = () => ({
  getFuelFlowToLoadTests: jest.fn().mockResolvedValue(fuelFlowToLoadTests),
  getFuelFlowToLoadTest: jest.fn().mockResolvedValue(fuelFlowToLoadTest),
  createFuelFlowToLoadTest: jest.fn().mockResolvedValue(fuelFlowToLoadTest),
});

const payload = new FuelFlowToLoadTestBaseDTO();

describe('FuelFlowToLoadTestWorkspaceController', () => {
  let controller: FuelFlowToLoadTestWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FuelFlowToLoadTestWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
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

  describe('getFuelFlowToLoadTests', () => {
    it('Calls the repository to get all Fuel Flow To Load Test records by Test Summary Id', async () => {
      const result = await controller.getFuelFlowToLoadTests(locId, testSumId);
      expect(result).toEqual(fuelFlowToLoadTests);
    });
  });

  describe('getFuelFlowToLoadTest', () => {
    it('Calls the repository to get one Fuel Flow To Load Test record by Id', async () => {
      const result = await controller.getFuelFlowToLoadTest(
        locId,
        testSumId,
        fuelFlowToLoadTestId,
      );
      expect(result).toEqual(fuelFlowToLoadTest);
    });
  });

  describe('createFuelFlowToLoadTest', () => {
    it('Calls the service to create a new fuel Flow To Load Test record', async () => {
      const result = await controller.createFuelFlowToLoadTest(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(fuelFlowToLoadTest);
    });
  });
});
