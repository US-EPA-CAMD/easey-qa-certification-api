import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadTestController } from './fuel-flow-to-load-test.controller';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';

describe('FuelFlowToLoadTestController', () => {
  let controller: FuelFlowToLoadTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelFlowToLoadTestController],
      providers: [FuelFlowToLoadTestService],
    }).compile();

    controller = module.get<FuelFlowToLoadTestController>(
      FuelFlowToLoadTestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
