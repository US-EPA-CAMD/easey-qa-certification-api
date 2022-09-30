import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';

describe('FuelFlowToLoadTestService', () => {
  let service: FuelFlowToLoadTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelFlowToLoadTestService],
    }).compile();

    service = module.get<FuelFlowToLoadTestService>(FuelFlowToLoadTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
