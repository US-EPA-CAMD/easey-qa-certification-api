import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';

describe('AppEHeatInputFromGasWorkspaceService', () => {
  let service: AppEHeatInputFromGasWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppEHeatInputFromGasWorkspaceService],
    }).compile();

    service = module.get<AppEHeatInputFromGasWorkspaceService>(
      AppEHeatInputFromGasWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
