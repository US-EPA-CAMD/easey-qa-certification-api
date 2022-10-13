import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineController } from './fuel-flow-to-load-baseline.controller';
import { FuelFlowToLoadBaselineService } from './fuel-flow-to-load-baseline.service';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const testSumId = '';
const id = '';
const dto = new FuelFlowToLoadBaselineDTO();

const mockService = () => ({
  getFuelFlowToLoadBaseline: jest.fn().mockResolvedValue(dto),
  getFuelFlowToLoadBaselines: jest.fn().mockResolvedValue([dto]),
});

describe('FuelFlowToLoadBaselineController', () => {
  let controller: FuelFlowToLoadBaselineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FuelFlowToLoadBaselineController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FuelFlowToLoadBaselineService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FuelFlowToLoadBaselineController>(
      FuelFlowToLoadBaselineController,
    );
  });

  describe('getFuelFlowToLoadBaseline', () => {
    it('Calls the service to get a fuel Flow To Load Baseline record', async () => {
      const result = await controller.getFuelFlowToLoadBaseline(
        locId,
        testSumId,
        id,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('getFuelFlowToLoadBaselines', () => {
    it('Calls the service to many fuel Flow To Load Baseline records', async () => {
      const result = await controller.getFuelFlowToLoadBaselines(
        locId,
        testSumId,
      );
      expect(result).toEqual([dto]);
    });
  });
});
