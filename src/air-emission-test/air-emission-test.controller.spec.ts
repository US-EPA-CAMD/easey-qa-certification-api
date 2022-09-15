import { Test, TestingModule } from '@nestjs/testing';
import { AirEmissionTestController } from './air-emission-test.controller';
import { AirEmissionTestService } from './air-emission-test.service';

describe('AirEmissionTestController', () => {
  let controller: AirEmissionTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirEmissionTestController],
      providers: [AirEmissionTestService],
    }).compile();

    controller = module.get<AirEmissionTestController>(
      AirEmissionTestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
