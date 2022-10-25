import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasRecordDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasController } from './app-e-heat-input-from-gas.controller';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

const locId = '';
const testSumId = '';
const appECorrTestSumId = '';
const appECorrTestRunId = '';
const appEHIGasId = '';
const appEHIGasRecord = new AppEHeatInputFromGasRecordDTO();
const appEHIGasRecords = [appEHIGasRecord];

const mockService = () => ({
  getAppEHeatInputFromGases: jest.fn().mockResolvedValue(appEHIGasRecords),
  getAppEHeatInputFromGas: jest.fn().mockResolvedValue(appEHIGasRecord),
});

describe('AppEHeatInputFromGasController', () => {
  let controller: AppEHeatInputFromGasController;
  let service: AppEHeatInputFromGasService;

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
    service = module.get<AppEHeatInputFromGasService>(
      AppEHeatInputFromGasService,
    );
  });

  describe('getAppEHeatInputFromGasRecords', () => {
    it('Should call the AppEHeatInputFromGasService.getAppEHeatInputFromGases', async () => {
      jest
        .spyOn(service, 'getAppEHeatInputFromGases')
        .mockResolvedValue(appEHIGasRecords);
      expect(
        await controller.getAppEHeatInputFromGases(
          locId,
          testSumId,
          appECorrTestSumId,
          appECorrTestRunId,
        ),
      ).toBe(appEHIGasRecords);
    });
  });

  describe('getAppEHeatInputFromOilRecord', () => {
    it('Should call the AppEHeatInputFromGasService.getAppEHeatInputFromGas', async () => {
      const result = await controller.getAppEHeatInputFromGas(
        locId,
        testSumId,
        appECorrTestSumId,
        appECorrTestRunId,
        appEHIGasId,
      );
      expect(result).toEqual(appEHIGasRecord);
      expect(service.getAppEHeatInputFromGas).toHaveBeenCalled();
    });
  });
});
