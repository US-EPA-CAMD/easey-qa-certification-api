import { Test, TestingModule } from '@nestjs/testing';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';

describe('CalibrationInjectionWorkspaceService', () => {
  let service: CalibrationInjectionWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalibrationInjectionWorkspaceService],
    }).compile();

    service = module.get<CalibrationInjectionWorkspaceService>(
      CalibrationInjectionWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
