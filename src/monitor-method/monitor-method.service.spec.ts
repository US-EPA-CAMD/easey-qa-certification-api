import { Test, TestingModule } from '@nestjs/testing';
import { MonitorMethodService } from './monitor-method.service';

describe('MonitorMethodService', () => {
  let service: MonitorMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorMethodService],
    }).compile();

    service = module.get<MonitorMethodService>(MonitorMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
