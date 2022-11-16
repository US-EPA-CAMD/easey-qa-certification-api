import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FuelFlowmeterAccuracyBaseDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyController } from './fuel-flowmeter-accuracy.controller';
import { FuelFlowmeterAccuracyService } from './fuel-flowmeter-accuracy.service';

const locId = '';
const testSumId = '';
const fuelFlowmeterAccuracyId = '';
const fuelFlowmeterAccuracy = new FuelFlowmeterAccuracyBaseDTO();

const mockFuelFlowmeterAccuracyService = () => ({
  getFuelFlowmeterAccuracies: jest
    .fn()
    .mockResolvedValue([fuelFlowmeterAccuracy]),
  getFuelFlowmeterAccuracy: jest.fn().mockResolvedValue(fuelFlowmeterAccuracy),
});

describe('FuelFlowToLoadTestController', () => {
  let controller: FuelFlowmeterAccuracyController;
  let service: FuelFlowmeterAccuracyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FuelFlowmeterAccuracyController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FuelFlowmeterAccuracyService,
          useFactory: mockFuelFlowmeterAccuracyService,
        },
      ],
    }).compile();

    controller = module.get<FuelFlowmeterAccuracyController>(
      FuelFlowmeterAccuracyController,
    );
    service = module.get<FuelFlowmeterAccuracyService>(
      FuelFlowmeterAccuracyService,
    );
  });

  describe('getFuelFlowmeterAccuracies', () => {
    it('Calls the repository to get all Fuel Flowmeter Accuracy records by Test Summary Id', async () => {
      const result = await controller.getFuelFlowmeterAccuracies(
        locId,
        testSumId,
      );
      expect(result).toEqual([fuelFlowmeterAccuracy]);
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
});
