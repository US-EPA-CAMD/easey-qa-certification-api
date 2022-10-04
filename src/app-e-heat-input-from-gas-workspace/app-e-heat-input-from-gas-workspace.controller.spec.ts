import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasWorkspaceController } from './app-e-heat-input-from-gas-workspace.controller';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';

describe('AppEHeatInputFromGasWorkspaceController', () => {
  let controller: AppEHeatInputFromGasWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppEHeatInputFromGasWorkspaceController],
      providers: [AppEHeatInputFromGasWorkspaceService],
    }).compile();

    controller = module.get<AppEHeatInputFromGasWorkspaceController>(AppEHeatInputFromGasWorkspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
