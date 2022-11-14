import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { FuelFlowmeterAccuracyBaseDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyWorkspaceController } from './fuel-flowmeter-accuracy-workspace.controller';
import { FuelFlowmeterAccuracyWorkspaceService } from './fuel-flowmeter-accuracy-workspace.service';

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

const fuelFlowmeterAccuracyId = '';
const fuelFlowmeterAccuracy = new FuelFlowmeterAccuracyBaseDTO();
const fuelFlowmeterAccuracies = [fuelFlowmeterAccuracy];

const mockService = () => ({
  getFuelFlowmeterAccuracies: jest
    .fn()
    .mockResolvedValue(fuelFlowmeterAccuracies),
  getFuelFlowmeterAccuracy: jest.fn().mockResolvedValue(fuelFlowmeterAccuracy),
  createFuelFlowmeterAccuracy: jest
    .fn()
    .mockResolvedValue(fuelFlowmeterAccuracy),
  editFuelFlowmeterAccuracy: jest.fn().mockResolvedValue(fuelFlowmeterAccuracy),
  deleteFuelFlowmeterAccuracy: jest.fn().mockResolvedValue(undefined),
});

const payload = new FuelFlowmeterAccuracyBaseDTO();

describe('FuelFlowmeterAccuracyWorkspaceController', () => {
  let controller: FuelFlowmeterAccuracyWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FuelFlowmeterAccuracyWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FuelFlowmeterAccuracyWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FuelFlowmeterAccuracyWorkspaceController>(
      FuelFlowmeterAccuracyWorkspaceController,
    );
  });

  describe('getFuelFlowmeterAccuracies', () => {
    it('Calls the repository to get all Fuel Flowmeter Accuracy records by Test Summary Id', async () => {
      const result = await controller.getFuelFlowmeterAccuracies(
        locId,
        testSumId,
      );
      expect(result).toEqual(fuelFlowmeterAccuracies);
    });
  });

  describe('getFuelFlowmeterAccuracy', () => {
    it('Calls the repository to get one Fuel Flowmeter Accuracy record by Id', async () => {
      const result = await controller.getFuelFlowmeterAccuracy(
        locId,
        testSumId,
        fuelFlowmeterAccuracyId,
      );
      expect(result).toEqual(fuelFlowmeterAccuracy);
    });
  });

  describe('createFuelFlowmeterAccuracy', () => {
    it('Calls the service to create a new Fuel Flowmeter Accuracy record', async () => {
      const result = await controller.createFuelFlowmeterAccuracy(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(fuelFlowmeterAccuracy);
    });
  });

  describe('editFuelFlowmeterAccuracy', () => {
    it('should call the Fuel Flowmeter Accuracy record', async () => {
      expect(
        await controller.editFuelFlowmeterAccuracy(
          locId,
          testSumId,
          fuelFlowmeterAccuracyId,
          payload,
          user,
        ),
      ).toEqual(fuelFlowmeterAccuracy);
    });
  });
  describe('deleteFuelFlowmeterAccuracy', () => {
    it('Calls the service and delete a Fuel Flowmeter record', async () => {
      const result = await controller.deleteFuelFlowmeterAccuracy(
        locId,
        testSumId,
        fuelFlowmeterAccuracyId,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
