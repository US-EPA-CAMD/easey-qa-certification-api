import { Test, TestingModule } from '@nestjs/testing';
import { CalibrationInjectionService } from './calibration-injection.service';

describe('CalibrationInjectionService', () => {
  let service: CalibrationInjectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalibrationInjectionService],
    }).compile();

    service = module.get<CalibrationInjectionService>(
      CalibrationInjectionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
