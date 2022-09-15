import { Test, TestingModule } from '@nestjs/testing';
import { AirEmissionTestingService } from './air-emission-testing.service';

describe('AirEmissionTestingService', () => {
  let service: AirEmissionTestingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirEmissionTestingService],
    }).compile();

    service = module.get<AirEmissionTestingService>(AirEmissionTestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
