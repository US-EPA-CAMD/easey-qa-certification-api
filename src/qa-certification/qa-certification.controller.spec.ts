import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { LinearitySummaryRepository } from '../linearity-summary/linearity-summary.repository';
import { LinearityInjectionService } from '../linearity-injection/linearity-injection.service';
import { LinearityInjectionRepository } from '../linearity-injection/linearity-injection.repository';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryService } from '../linearity-summary/linearity-summary.service';
import { TestSummaryRepository } from '../test-summary/test-summary.repository';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationDTO } from '../dto/qa-certification.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { RataMap } from '../maps/rata.map';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataRunMap } from '../maps/rata-run.map';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { RataRunService } from '../rata-run/rata-run.service';
import { RataSummaryService } from '../rata-summary/rata-summary.service';
import { RataService } from '../rata/rata.service';
import { RataRepository } from '../rata/rata.repository';
import { RataSummaryRepository } from '../rata-summary/rata-summary.repository';
import { RataRunRepository } from '../rata-run/rata-run.repository';

describe('QA Certification Controller Test', () => {
  let controller: QACertificationController;
  let service: QACertificationService;
  let req: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [QACertificationController],
      providers: [
        QACertificationService,
        ConfigService,
        TestSummaryService,
        TestSummaryMap,
        LinearitySummaryService,
        TestSummaryRepository,
        LinearitySummaryMap,
        LinearitySummaryRepository,
        LinearityInjectionService,
        LinearityInjectionMap,
        LinearityInjectionRepository,
        ProtocolGasMap,
        RataRepository,
        RataService,
        RataMap,
        RataSummaryRepository,
        RataSummaryService,
        RataSummaryMap,
        RataRunRepository,
        RataRunService,
        RataRunMap,
        TestQualificationMap,
        AirEmissionTestingMap,
      ],
    }).compile();

    controller = module.get(QACertificationController);
    service = module.get(QACertificationService);
  });

  it('should return', async () => {
    const expectedResult = new QACertificationDTO();
    const paramsDto = new QACertificationParamsDTO();
    jest.spyOn(service, 'export').mockResolvedValue(expectedResult);
    expect(await controller.export(paramsDto)).toBe(expectedResult);
  });
});
