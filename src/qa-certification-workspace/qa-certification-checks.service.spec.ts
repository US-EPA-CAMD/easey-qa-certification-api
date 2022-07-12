import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { LinearityInjectionChecksService } from '../linearity-injection-workspace/linearity-injection-checks.service';
import { LinearitySummaryChecksService } from '../linearity-summary-workspace/linearity-summary-checks.service';
import { LocationChecksService } from '../location-workspace/location-checks.service';
import { TestSummaryChecksService } from '../test-summary-workspace/test-summary-checks.service';
import { QACertificationChecksService } from './qa-certification-checks.service';

describe('QA Certification Check Service Test', () => {
  let service: QACertificationChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationChecksService,
        {
          provide: LocationChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([[{ unitId: '51' }], []]),
          }),
        },
        {
          provide: TestSummaryChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: LinearitySummaryChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: LinearityInjectionChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get(QACertificationChecksService);
  });

  describe('Linearity Injection Checks', () => {
    const payload = new QACertificationImportDTO();
    payload.orisCode = 1;

    const testSumary = new TestSummaryImportDTO();
    testSumary.unitId = '51';
    testSumary.testTypeCode = TestTypeCodes.LINE;
    payload.testSummaryData = [testSumary];

    it('Should pass all checks', async () => {
      const result = await service.runChecks(payload);
      expect(result).toEqual([]);
    });
  });
});
