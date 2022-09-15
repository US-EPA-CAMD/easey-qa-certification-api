import { Test, TestingModule } from '@nestjs/testing';
import { AirEmissionTestingController } from './air-emission-testing.controller';
import { AirEmissionTestingService } from './air-emission-testing.service';

describe('AirEmissionTestingController', () => {
  let controller: AirEmissionTestingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirEmissionTestingController],
      providers: [AirEmissionTestingService],
    }).compile();

    controller = module.get<AirEmissionTestingController>(
      AirEmissionTestingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
