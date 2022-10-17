import { Test, TestingModule } from '@nestjs/testing';
import { CalibrationInjectionWorkspaceController } from './calibration-injection-workspace.controller';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';

describe('CalibrationInjectionWorkspaceController', () => {
  let controller: CalibrationInjectionWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalibrationInjectionWorkspaceController],
      providers: [CalibrationInjectionWorkspaceService],
    }).compile();

    controller = module.get<CalibrationInjectionWorkspaceController>(
      CalibrationInjectionWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
