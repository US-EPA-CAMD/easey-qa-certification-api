import { Test, TestingModule } from '@nestjs/testing';
import { AirEmissionTestService } from './air-emission-test.service';

describe('AirEmissionTestService', () => {
  let service: AirEmissionTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirEmissionTestService],
    }).compile();

    service = module.get<AirEmissionTestService>(AirEmissionTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
