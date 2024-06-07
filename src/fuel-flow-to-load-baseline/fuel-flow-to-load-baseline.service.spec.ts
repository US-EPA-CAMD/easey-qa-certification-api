import { Test, TestingModule } from '@nestjs/testing';

import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaseline } from '../entities/fuel-flow-to-load-baseline.entity';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { FuelFlowToLoadBaselineRepository } from './fuel-flow-to-load-baseline.repository';
import { FuelFlowToLoadBaselineService } from './fuel-flow-to-load-baseline.service';

const id = '';
const testSumId = '';
const entity = new FuelFlowToLoadBaseline();
const dto = new FuelFlowToLoadBaselineDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('FuelFlowToLoadBaselineService', () => {
  let service: FuelFlowToLoadBaselineService;
  let repository: FuelFlowToLoadBaselineRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelFlowToLoadBaselineService,
        {
          provide: FuelFlowToLoadBaselineRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowToLoadBaselineMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FuelFlowToLoadBaselineService>(
      FuelFlowToLoadBaselineService,
    );
    repository = module.get<FuelFlowToLoadBaselineRepository>(
      FuelFlowToLoadBaselineRepository,
    );
  });

  describe('getFuelFlowToLoadBaselines', () => {
    it('Should return Fuel Flow To Load Baseline records by Test Summary id', async () => {
      const result = await service.getFuelFlowToLoadBaselines(testSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getFuelFlowToLoadBaseline', () => {
    it('Should return a Fuel Flow To Load Baseline record', async () => {
      const result = await service.getFuelFlowToLoadBaseline(id, testSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Fuel Flow To Load Baseline record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getFuelFlowToLoadBaseline(id, testSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
