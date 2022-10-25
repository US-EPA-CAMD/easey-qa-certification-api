import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadTestDTO } from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestController } from './fuel-flow-to-load-test.controller';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

const locId = 'locationId';
const testSumId = 'testSummaryId';
const fuelFlowToLoadTestId = 'fuelFlowToLoadTestId';
const fuelFlowLoadToTestDTO = new FuelFlowToLoadTestDTO();

const mockFuelFlowToLoadTestService = () => ({
  getFuelFlowToLoadTests: jest.fn().mockResolvedValue([fuelFlowLoadToTestDTO]),
  getFuelFlowToLoadTest: jest.fn().mockResolvedValue(fuelFlowLoadToTestDTO),
});

describe('FuelFlowToLoadTestController', () => {
  let controller: FuelFlowToLoadTestController;
  let service: FuelFlowToLoadTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FuelFlowToLoadTestController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FuelFlowToLoadTestService,
          useFactory: mockFuelFlowToLoadTestService,
        },
      ],
    }).compile();

    controller = module.get<FuelFlowToLoadTestController>(
      FuelFlowToLoadTestController,
    );
    service = module.get<FuelFlowToLoadTestService>(FuelFlowToLoadTestService);
  });

  describe('getFuelFlowToLoadTests', () => {
    it('Calls the repository to get all Fuel Flow To Load Test records by Test Summary Id', async () => {
      const result = await controller.getFuelFlowToLoadTests(locId, testSumId);
      expect(result).toEqual([fuelFlowLoadToTestDTO]);
    });
  });

  describe('getFuelFlowToLoadTest', () => {
    it('Calls the repository to get one Fuel Flow To Load Test record by Id', async () => {
      const result = await controller.getFuelFlowToLoadTest(
        locId,
        testSumId,
        fuelFlowToLoadTestId,
      );
      expect(result).toEqual(fuelFlowLoadToTestDTO);
    });
  });
});
