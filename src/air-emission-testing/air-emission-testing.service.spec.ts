import { Test, TestingModule } from '@nestjs/testing';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { AirEmissionTestingRepository } from './air-emission-testing.repository';
import { AirEmissionTestingService } from './air-emission-testing.service';

describe('AirEmissionTestingService', () => {
  let service: AirEmissionTestingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirEmissionTestingService,
        AirEmissionTestingRepository,
        AirEmissionTestingMap,
      ],
    }).compile();

    service = module.get<AirEmissionTestingService>(AirEmissionTestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
