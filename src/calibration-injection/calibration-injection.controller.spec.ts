import { Test, TestingModule } from '@nestjs/testing';
import { CalibrationInjectionController } from './calibration-injection.controller';
import { CalibrationInjectionService } from './calibration-injection.service';

describe('CalibrationInjectionController', () => {
  let controller: CalibrationInjectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalibrationInjectionController],
      providers: [CalibrationInjectionService],
    }).compile();

    controller = module.get<CalibrationInjectionController>(
      CalibrationInjectionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
