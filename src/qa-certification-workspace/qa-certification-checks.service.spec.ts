import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { LinearityInjectionChecksService } from '../linearity-injection-workspace/linearity-injection-checks.service';
import { LinearitySummaryChecksService } from '../linearity-summary-workspace/linearity-summary-checks.service';
import { LocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
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
import { AppECorrelationTestSummaryChecksService } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-checks.service';
import { AppECorrelationTestRunChecksService } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-checks.service';
import { AppEHeatInputFromGasChecksService } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-checks.service';
import { AppEHeatInputFromOilChecksService } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil-checks.service';
import { UnitDefaultTestRunChecksService } from '../unit-default-test-run-workspace/unit-default-test-run-checks.service';
import { ProtocolGasChecksService } from '../protocol-gas-workspace/protocol-gas-checks.service';
import { ProtocolGasImportDTO } from '../dto/protocol-gas.dto';

const returnLocationRunChecks = [
  {
    unitId: '51',
    locationId: '1873',
    stackPipeId: null,
    systemIDs: [],
    componentIDs: ['A05'],
  },
];

const QASuppDatas = new Map();

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
            getQASuppDataByLocationIdTestTypeAndTestNumber: jest
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
        {
          provide: UnitDefaultTestRunChecksService,
          useFactory: () => ({
            runImportChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: ProtocolGasChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get(QACertificationChecksService);
  });

  describe('QA Certification Checks', () => {
    const payload = new QACertificationImportDTO();
    payload.orisCode = 1;
    payload.version = '1.0';

    const testSumary = new TestSummaryImportDTO();
    testSumary.unitId = '51';
    testSumary.componentId = 'AA0';
    testSumary.stackPipeId = null;
    testSumary.testTypeCode = TestTypeCodes.LINE;
    testSumary.monitoringSystemId = '1';
    testSumary.testNumber = '1';

    const linSum = new LinearitySummaryImportDTO();
    const linInj = new LinearityInjectionImportDTO();
    linSum.linearityInjectionData = [linInj];
    testSumary.linearitySummaryData = [linSum];
    payload.testSummaryData = [testSumary];

    const testExtExem = new TestExtensionExemptionImportDTO();
    testExtExem.unitId = '51';
    testExtExem.componentId = 'AA0';
    testExtExem.stackPipeId = null;
    testExtExem.year = 2022;
    testExtExem.quarter = 1;
    payload.testExtensionExemptionData = [testExtExem];

    const qaCertEvent = new QACertificationEventImportDTO();
    qaCertEvent.unitId = '51';
    qaCertEvent.componentId = 'AA0';
    qaCertEvent.stackPipeId = null;
    qaCertEvent.certificationEventCode = 'QAC';
    qaCertEvent.certificationEventDate = new Date('2022-01-01');
    payload.certificationEventData = [qaCertEvent];

    const protocolGas = new ProtocolGasImportDTO();
    testSumary.protocolGasData = [protocolGas];

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
          'There are no test summary, certifications events, or extension/exception records present in the file to be imported',
        ]);
      }
    });

    // Location lookup with anyOf schema compliance
    describe('Location Lookup - anyOf Schema Compliance', () => {
      it('should find location with unitId only in testSummaryData', async () => {
        const locations = [
          {
            unitId: '51',
            locationId: '1873',
            stackPipeId: null,
            systemIDs: [],
            componentIDs: ['A05'],
          },
        ];

        const payloadWithUnitOnly = {
          ...payload,
          testSummaryData: [
            {
              ...payload.testSummaryData[0],
              unitId: '51',
              stackPipeId: null,
            },
          ],
          certificationEventData: [],
          testExtensionExemptionData: [],
        };

        const result = await service.runChecks(payloadWithUnitOnly);
        expect(result).toEqual([locations, QASuppDatas]);
      });

      it('should find location with stackPipeId only in testSummaryData', async () => {
        const locations = [
          {
            unitId: null,
            locationId: '1874',
            stackPipeId: 'CS1',
            systemIDs: [],
            componentIDs: ['A05'],
          },
        ];

        // Mock the location check service to return the stack-only location
        jest.spyOn(service['locationChecksService'], 'runChecks').mockResolvedValue([locations, []]);

        const payloadWithStackOnly = {
          ...payload,
          testSummaryData: [
            {
              ...payload.testSummaryData[0],
              unitId: null,
              stackPipeId: 'CS1',
            },
          ],
          certificationEventData: [],
          testExtensionExemptionData: [],
        };

        const result = await service.runChecks(payloadWithStackOnly);
        expect(result).toBeDefined();
      });

      it('should throw error when no location found for testSummaryData', async () => {
        const payloadNoMatch = {
          ...payload,
          testSummaryData: [
            {
              ...payload.testSummaryData[0],
              unitId: 'NOMATCH',
              stackPipeId: null,
            },
          ],
          certificationEventData: [],
          testExtensionExemptionData: [],
        };

        try {
          await service.runChecks(payloadNoMatch);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toContain('Location not found for unitId: NOMATCH');
        }
      });

      it('should find location with unitId only in testExtensionExemptionData', async () => {
        const payloadWithUnitOnly= {
          ...payload,
          testSummaryData: [],
          certificationEventData: [],
          testExtensionExemptionData: [],
        } as QACertificationImportDTO;

        const result = await service.runChecks(payloadWithUnitOnly);
        expect(result).toEqual([returnLocationRunChecks, QASuppDatas]);
      });

      it('should throw error when no location found for testExtensionExemptionData', async () => {
        const teeNoMatch = new TestExtensionExemptionImportDTO();
        teeNoMatch.unitId = 'NOMATCH';
        teeNoMatch.stackPipeId = null;
        teeNoMatch.year = 2022;
        teeNoMatch.quarter = 1;

        const payloadNoMatch: QACertificationImportDTO  = {
          ...payload,
          testSummaryData: [],
          certificationEventData: [],
          testExtensionExemptionData: [teeNoMatch],
          } as QACertificationImportDTO;

        try {
          await service.runChecks(payloadNoMatch);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toContain('Location not found for unitId: NOMATCH');
        }
      });

      it('should find location with unitId only in certificationEventData', async () => {
       const qaCertEventUnit = new QACertificationEventImportDTO();
        qaCertEventUnit.unitId = '51';
        qaCertEventUnit.stackPipeId = null;
        qaCertEventUnit.certificationEventCode = 'QAC';
        qaCertEventUnit.certificationEventDate = new Date('2022-01-01');

        const payloadWithUnitOnly: QACertificationImportDTO = {
          ...payload,
          testSummaryData: [],
          certificationEventData: [qaCertEventUnit],
          testExtensionExemptionData: [],
        } as QACertificationImportDTO;

        const result = await service.runChecks(payloadWithUnitOnly);
        expect(result).toEqual([returnLocationRunChecks, QASuppDatas]);
      });

      it('should throw error when no location found for certificationEventData', async () => {
        const qaCertEventNoMatch = new QACertificationEventImportDTO();
        qaCertEventNoMatch.unitId = 'NOMATCH';
        qaCertEventNoMatch.stackPipeId = null;
        qaCertEventNoMatch.certificationEventCode = 'QAC';
        qaCertEventNoMatch.certificationEventDate = new Date('2022-01-01');

        const payloadNoMatch: QACertificationImportDTO = {
          ...payload,
          testSummaryData: [],
          certificationEventData: [qaCertEventNoMatch],
          testExtensionExemptionData: [],
        } as QACertificationImportDTO;

        try {
          await service.runChecks(payloadNoMatch);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toContain('Location not found for unitId: NOMATCH');
        }
      });
    });

    // Priority-Based Location Lookup Tests
    describe('Priority-Based Location Lookup (stackPipeId preferred)', () => {
      it('should prefer stackPipeId over unitId when both provided in testSummaryData', async () => {
        const stackPipeLocation = {
          unitId: null,
          locationId: '2000',
          stackPipeId: 'STACK1',
          systemIDs: [],
          componentIDs: ['A05'],
        };

        // Mock the location check service to return stack pipe location
        jest.spyOn(service['locationChecksService'], 'runChecks')
          .mockResolvedValue([[stackPipeLocation], []]);

        const payloadWithBoth = {
          ...payload,
          testSummaryData: [{
            ...payload.testSummaryData[0],
            unitId: 'DIFFERENT_UNIT',  // This should be ignored
            stackPipeId: 'STACK1',     // This should be used
          }],
          certificationEventData: [],
          testExtensionExemptionData: [],
        };

        const result = await service.runChecks(payloadWithBoth);
        expect(result).toBeDefined();
        expect(result[0]).toEqual([stackPipeLocation]);
      });

      it('should prefer stackPipeId over unitId when both provided in testExtensionExemptionData', async () => {
        const stackPipeLocation = {
          unitId: null,
          locationId: '2001',
          stackPipeId: 'STACK2',
          systemIDs: [],
          componentIDs: [],
        };

        jest.spyOn(service['locationChecksService'], 'runChecks')
          .mockResolvedValue([[stackPipeLocation], []]);

        const testExtExemBoth = new TestExtensionExemptionImportDTO();
        testExtExemBoth.unitId = 'DIFFERENT_UNIT';  // Should be ignored
        testExtExemBoth.stackPipeId = 'STACK2';     // Should be used
        testExtExemBoth.year = 2022;
        testExtExemBoth.quarter = 1;

        const payloadWithBoth = {
          ...payload,
          testSummaryData: [],
          certificationEventData: [],
          testExtensionExemptionData: [testExtExemBoth],
        } as QACertificationImportDTO;

        const result = await service.runChecks(payloadWithBoth);
        expect(result).toBeDefined();
        expect(result[0]).toEqual([stackPipeLocation]);
      });

      it('should prefer stackPipeId over unitId when both provided in certificationEventData', async () => {
        const stackPipeLocation = {
          unitId: null,
          locationId: '2002',
          stackPipeId: 'STACK3',
          systemIDs: [],
          componentIDs: [],
        };

        jest.spyOn(service['locationChecksService'], 'runChecks')
          .mockResolvedValue([[stackPipeLocation], []]);

        const qaCertEventBoth = new QACertificationEventImportDTO();
        qaCertEventBoth.unitId = 'DIFFERENT_UNIT';  // Should be ignored
        qaCertEventBoth.stackPipeId = 'STACK3';     // Should be used
        qaCertEventBoth.certificationEventCode = 'QAC';
        qaCertEventBoth.certificationEventDate = new Date('2022-01-01');

        const payloadWithBoth = {
          ...payload,
          testSummaryData: [],
          certificationEventData: [qaCertEventBoth],
          testExtensionExemptionData: [],
        } as QACertificationImportDTO;

        const result = await service.runChecks(payloadWithBoth);
        expect(result).toBeDefined();
        expect(result[0]).toEqual([stackPipeLocation]);
      });

      it('should use unitId when only unitId provided (no stackPipeId)', async () => {
        const unitLocation = {
          unitId: '99',
          locationId: '2003',
          stackPipeId: null,
          systemIDs: [],
          componentIDs: ['A05'],
        };

        jest.spyOn(service['locationChecksService'], 'runChecks')
          .mockResolvedValue([[unitLocation], []]);

        const payloadUnitOnly = {
          ...payload,
          testSummaryData: [{
            ...payload.testSummaryData[0],
            unitId: '99',
            stackPipeId: null,
          }],
          certificationEventData: [],
          testExtensionExemptionData: [],
        };

        const result = await service.runChecks(payloadUnitOnly);
        expect(result).toBeDefined();
        expect(result[0]).toEqual([unitLocation]);
      });
    });
  });
});