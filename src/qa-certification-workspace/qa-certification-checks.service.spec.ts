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

const returnLocationRunChecks = [
  {
    unitId: '51',
    locationId: '1873',
    stackPipeId: null,
    systemIDs: [],
    componentIDs: ['A05'],
  },
];

const QASuppDatas = [undefined];

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
              .mockResolvedValue(undefined),
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
