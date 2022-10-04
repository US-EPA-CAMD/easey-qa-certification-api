import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';

describe('AppEHeatInputFromGasService', () => {
  let service: AppEHeatInputFromGasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppEHeatInputFromGasService],
    }).compile();

    service = module.get<AppEHeatInputFromGasService>(
      AppEHeatInputFromGasService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
