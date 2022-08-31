import { Test, TestingModule } from '@nestjs/testing';
import { MonitorSystemService } from './monitor-system.service';

describe('MonitorSystemService', () => {
  let service: MonitorSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorSystemService],
    }).compile();

    service = module.get<MonitorSystemService>(MonitorSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
