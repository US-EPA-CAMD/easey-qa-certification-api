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
import { LinearitySummaryImportDTO } from '../dto/linearity-summary.dto';
import { LinearityInjectionImportDTO } from '../dto/linearity-injection.dto';
import { BadRequestException } from '@nestjs/common';
import { RataChecksService } from '../rata-workspace/rata-checks.service';
import { RataSummaryChecksService } from '../rata-summary-workspace/rata-summary-checks.service';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { RataRunChecksService } from '../rata-run-workspace/rata-run-checks.service';
import { FlowRataRunChecksService } from '../flow-rata-run-workspace/flow-rata-run-checks.service';
import { RataTraverseChecksService } from '../rata-traverse-workspace/rata-traverse-checks.service';
import { TestQualificationChecksService } from '../test-qualification-workspace/test-qualification-checks.service';
import { TestExtensionExemptionsChecksService } from '../test-extension-exemptions-workspace/test-extension-exemptions-checks.service';
import { TestExtensionExemptionImportDTO } from '../dto/test-extension-exemption.dto';
import { CycleTimeInjectionChecksService } from '../cycle-time-injection-workspace/cycle-time-injection-workspace-checks.service';
import { QACertificationEventImportDTO } from '../dto/qa-certification-event.dto';
import { QACertificationEventChecksService } from '../qa-certification-event-workspace/qa-certification-event-checks.service';
import { AppECorrelationTestSummaryChecksService} from "../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-checks.service";
import { AppECorrelationTestRunChecksService} from "../app-e-correlation-test-run-workspace/app-e-correlation-test-run-checks.service";
import { AppEHeatInputFromGasChecksService} from "../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-checks.service";
import { AppEHeatInputFromOilChecksService} from "../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil-checks.service";

const returnLocationRunChecks = [
  {
    unitId: '51',
    locationId: '1873',
    stackPipeId: null,
    systemIDs: [],
    componentIDs: ['A05'],
  },
];

const QASuppDatas = [];

describe('QA Certification Check Service Test', () => {
  let service: QACertificationChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationChecksService,
        {
          provide: QASuppDataWorkspaceRepository,
          useFactory: () => ({
            getQASuppDataByTestTypeCodeComponentIdEndDateEndTime: jest
              .fn()
              .mockResolvedValue(null),
          }),
        },
        {
          provide: LocationChecksService,
          useFactory: () => ({
            runChecks: jest
              .fn()
              .mockResolvedValue([returnLocationRunChecks, []]),
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
        {
          provide: RataChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: RataSummaryChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: RataRunChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: FlowRataRunChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: RataTraverseChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: TestQualificationChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: TestExtensionExemptionsChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: CycleTimeInjectionChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: QACertificationEventChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: AppECorrelationTestSummaryChecksService,
          useFactory: () => ({
            runImportChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: AppECorrelationTestRunChecksService,
          useFactory: () => ({
            runImportChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: AppEHeatInputFromOilChecksService,
          useFactory: () => ({
            runImportChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: AppEHeatInputFromGasChecksService,
          useFactory: () => ({
            runImportChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get(QACertificationChecksService);
  });

  describe('QA Certification Checks', () => {
    const payload = new QACertificationImportDTO();
    payload.orisCode = 1;

    const testSumary = new TestSummaryImportDTO();
    testSumary.unitId = '51';
    testSumary.componentID = 'AA0';
    testSumary.stackPipeId = null;
    testSumary.testTypeCode = TestTypeCodes.LINE;

    const linSum = new LinearitySummaryImportDTO();
    const linInj = new LinearityInjectionImportDTO();
    linSum.linearityInjectionData = [linInj];
    testSumary.linearitySummaryData = [linSum];
    payload.testSummaryData = [testSumary];

    const testExtExem = new TestExtensionExemptionImportDTO();
    testExtExem.unitId = '51';
    testExtExem.componentID = 'AA0';
    testExtExem.stackPipeId = null;
    payload.testExtensionExemptionData = [testExtExem];

    const qaCertEvent = new QACertificationEventImportDTO();
    qaCertEvent.unitId = '51';
    qaCertEvent.componentID = 'AA0';
    qaCertEvent.stackPipeId = null;
    payload.certificationEventData = [qaCertEvent];

    it('Should pass all checks', async () => {
      const result = await service.runChecks(payload);
      expect(result).toEqual([returnLocationRunChecks, QASuppDatas]);
    });

    it('should return error message A for IMPORT-13', async () => {
      const pl = {
        ...payload,
        testSummaryData: [],
        certificationEventData: [],
        testExtensionExemptionData: [],
      };
      try {
        await service.runChecks(pl);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.response.message).toEqual([
          'There are no test summary, certifications events, or extension/exmeption records present in the file to be imported',
        ]);
      }
    });
  });
});
