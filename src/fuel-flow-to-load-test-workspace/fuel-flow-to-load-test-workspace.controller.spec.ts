import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

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
  facilities: [],
  roles: [],
};
const fuelFlowToLoadTestId = 'fuelFlowToLoadTestId';
const fuelFlowToLoadTest = new FuelFlowToLoadTestDTO();
const fuelFlowToLoadTests = [fuelFlowToLoadTest];

const mockService = () => ({
  getFuelFlowToLoadTests: jest.fn().mockResolvedValue(fuelFlowToLoadTests),
  getFuelFlowToLoadTest: jest.fn().mockResolvedValue(fuelFlowToLoadTest),
  createFuelFlowToLoadTest: jest.fn().mockResolvedValue(fuelFlowToLoadTest),
  deleteFuelFlowToLoadTest: jest.fn().mockResolvedValue(undefined),
  editFuelFlowToLoadTest: jest.fn().mockResolvedValue(fuelFlowToLoadTest),
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
          provide: DataSource,
          useValue: {},
        },
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

  describe('editFuelFlowToLoadTest', () => {
    it('Calls the service and update a existing fuel Flow To Load Test record', async () => {
      const result = await controller.editFuelFlowToLoadTest(
        locId,
        testSumId,
        fuelFlowToLoadTestId,
        payload,
        user,
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

  describe('deleteFuelFlowToLoadTest', () => {
    it('Calls the service and delete a fuel Flow To Load Test record', async () => {
      const result = await controller.deleteFuelFlowToLoadTest(
        locId,
        testSumId,
        fuelFlowToLoadTestId,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
