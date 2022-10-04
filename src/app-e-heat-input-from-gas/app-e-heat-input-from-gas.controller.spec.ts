import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasController } from './app-e-heat-input-from-gas.controller';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';

describe('AppEHeatInputFromGasController', () => {
  let controller: AppEHeatInputFromGasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppEHeatInputFromGasController],
      providers: [AppEHeatInputFromGasService],
    }).compile();

    controller = module.get<AppEHeatInputFromGasController>(
      AppEHeatInputFromGasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
