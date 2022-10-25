import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadTestDTO } from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { FuelFlowToLoadTestRepository } from './fuel-flow-to-load-test.repository';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';

const id = '';
const testSumId = '';
const entity = new FuelFlowToLoadTest();
const dto = new FuelFlowToLoadTestDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('FuelFlowToLoadTestService', () => {
  let service: FuelFlowToLoadTestService;
  let repository: FuelFlowToLoadTestRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelFlowToLoadTestService,
        {
          provide: FuelFlowToLoadTestRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowToLoadTestMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FuelFlowToLoadTestService>(FuelFlowToLoadTestService);
    repository = module.get<FuelFlowToLoadTestRepository>(
      FuelFlowToLoadTestRepository,
    );
  });

  describe('getFuelFlowToLoadTests', () => {
    it('Should return Fuel Flow To Load Test records by Test Summary id', async () => {
      const result = await service.getFuelFlowToLoadTests(testSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getFuelFlowToLoadTest', () => {
    it('Should return a Fuel Flow To Load Test record', async () => {
      const result = await service.getFuelFlowToLoadTest(id, testSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Fuel Flow To Load Test record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getFuelFlowToLoadTest(id, testSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
