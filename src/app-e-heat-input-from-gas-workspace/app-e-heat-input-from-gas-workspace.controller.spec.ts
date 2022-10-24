import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasWorkspaceController } from './app-e-heat-input-from-gas-workspace.controller';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

const mockService = () => ({});

describe('AppEHeatInputFromGasWorkspaceController', () => {
  let controller: AppEHeatInputFromGasWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppEHeatInputFromGasWorkspaceController],
      providers: [
        Logger,
        ConfigService,
        AuthGuard,
        {
          provide: AppEHeatInputFromGasWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AppEHeatInputFromGasWorkspaceController>(
      AppEHeatInputFromGasWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
