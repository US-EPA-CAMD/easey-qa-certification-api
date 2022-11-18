import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

describe('CycleTimeInjectionService', () => {
  let service: CycleTimeInjectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CycleTimeInjectionService],
    }).compile();

    service = module.get<CycleTimeInjectionService>(CycleTimeInjectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
