import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasController } from './app-e-heat-input-from-gas.controller';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

const mockService = () => ({});

describe('AppEHeatInputFromGasController', () => {
  let controller: AppEHeatInputFromGasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppEHeatInputFromGasController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: AppEHeatInputFromGasService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AppEHeatInputFromGasController>(
      AppEHeatInputFromGasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
