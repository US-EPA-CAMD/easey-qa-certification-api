import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestResultCodes } from '../enums/test-result-code.enum';
import { RataImportDTO } from '../dto/rata.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataFrequencyCodeRepository } from '../rata-frequency-code/rata-frequency-code.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataChecksService } from './rata-checks.service';

const locationId = '';
const testSumId = '';

const monitorSystemRecord = new MonitorSystem();
let testSumRecord = {
  system: {
    systemTypeCode: 'FLOW',
  },
};
const rataFreqCdRecord = new RataFrequencyCode();

const importPayload = new RataImportDTO();
importPayload.numberOfLoadLevels = 1;
importPayload.rataFrequencyCode = 'OS';
importPayload.numberOfLoadLevels = 1;
importPayload.numberOfLoadLevels = 1;
const testSummaryImportPayload = new TestSummaryImportDTO();

const mockTestSummaryRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSumRecord),
});
const mockRataFrequencyCodeRepository = () => ({
  getRataFrequencyCode: jest.fn().mockResolvedValue(rataFreqCdRecord),
});
const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSystemRecord),
});

describe('Rata Checks Service Test', () => {
  let service: RataChecksService;
  let testSummaryRepository: TestSummaryWorkspaceRepository;
  let rataFreqCodeRepository: RataFrequencyCodeRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        RataChecksService,
        {
          provide: RataFrequencyCodeRepository,
          useFactory: mockRataFrequencyCodeRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSummaryRepository,
        },
      ],
    }).compile();

    service = module.get(RataChecksService);
    testSummaryRepository = module.get(TestSummaryWorkspaceRepository);
    rataFreqCodeRepository = module.get(RataFrequencyCodeRepository);
  });

  describe('RATA Checks', () => {
    it('Should pass all checks for Import', async () => {
      const result = await service.runChecks(
        locationId,
        importPayload,
        null,
        testSummaryImportPayload,
        true,
      );
      expect(result).toEqual([]);
    });

    it('Should pass all checks for POST or UPDATE', async () => {
      const result = await service.runChecks(
        locationId,
        importPayload,
        testSumId,
      );
      expect(result).toEqual([]);
    });
  });

  describe('RATA-102 Number of Load Levels Valid', () => {
    it('Should get [RATA-102-C] error ', async () => {
      importPayload.numberOfLoadLevels = 0;

      let testSumRec = new TestSummary();

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-102-C] The value [${importPayload.numberOfLoadLevels}] in the field [numberOfLoadLevels] for [RATA] is not within the range of valid values.`,
        ]);
      }
    });

    it('Should get [RATA-102-B] error ', async () => {
      importPayload.numberOfLoadLevels = 0;

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-102-B] The value [${importPayload.numberOfLoadLevels}] in the field [numberOfLoadLevels] for [RATA] is not within the range of valid values from [1] to [3].`,
        ]);
      }
    });
  });

  describe('RATA-103 Overall Relative Accuracy Valid', () => {
    it('Should get [RATA-103-A] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 3;
      importPayload.rataFrequencyCode = null;
      importPayload.overallBiasAdjustmentFactor = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.ABORTED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-103-A] You reported [relativeAccuracy], which is not appropriate for [].`,
        ]);
      }
    });

    it('Should get [RATA-103-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = null;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-103-B] You did not provide [relativeAccuracy], which is required for [RATA].`,
        ]);
      }
    });

    it('Should get [RATA-103-C] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = -1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-103-C] The value [-1] in the field [relativeAccuracy] for [RATA] is not within the range of valid values. This value must be greater than or equal to zero.`,
        ]);
      }
    });
  });

  describe('RATA-104 Overall BAF Valid', () => {
    it('Should get [RATA-104-A] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = null;
      importPayload.rataFrequencyCode = null;
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.ABORTED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-104-A] You reported [overallBiasAdjustmentFactor], which is not appropriate for [${testSumRec.testTypeCode}].`,
        ]);
      }
    });

    it('Should get [RATA-104-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-104-B] You did not provide [overallBiasAdjustmentFactor], which is required for [RATA].`,
        ]);
      }
    });

    it('Should get [RATA-104-C] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 0;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-104-C] The value [${importPayload.overallBiasAdjustmentFactor}] in the field [overallBiasAdjustmentFactor] for [RATA] is not within the range of valid values. This value must be greater than or equal to 1.000.`,
        ]);
      }
    });
  });

  describe('RATA-105 RATA Frequency Valid', () => {
    it('Should get [RATA-105-A] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.FAILED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-105-A] You reported [rataFrequencyCode], which is not appropriate for [${testSumRec.testTypeCode}].`,
        ]);
      }
    });

    it('Should get [RATA-105-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = null;
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-105-B] You did not provide [rataFrequencyCode], which is required for [RATA].`,
        ]);
      }
    });

    it('Should get [RATA-105-C] error with invalid rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);
      jest
        .spyOn(rataFreqCodeRepository, 'getRataFrequencyCode')
        .mockResolvedValue(null);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-105-C] You reported the value [${importPayload.rataFrequencyCode}], which is not in the list of valid values, in the field [rataFrequencyCode] for [RATA].`,
        ]);
      }
    });

    it('Should get [RATA-105-C] error with "8QTRS" rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = '8QTRS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';
      testSumRec.system = new MonitorSystem();
      testSumRec.system.systemDesignationCode = 'BS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);
      jest
        .spyOn(rataFreqCodeRepository, 'getRataFrequencyCode')
        .mockResolvedValue(rataFreqCdRecord);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-105-C] You reported the value [${importPayload.rataFrequencyCode}], which is not in the list of valid values, in the field [rataFrequencyCode] for [RATA].`,
        ]);
      }
    });

    it('Should get [RATA-105-C] error with "ALTSL" rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'ALTSL';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';
      testSumRec.system = new MonitorSystem();
      testSumRec.system.systemDesignationCode = 'BS';
      testSumRec.system.systemTypeCode = 'BS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);
      jest
        .spyOn(rataFreqCodeRepository, 'getRataFrequencyCode')
        .mockResolvedValue(rataFreqCdRecord);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([
          `[RATA-105-C] You reported the value [${importPayload.rataFrequencyCode}], which is not in the list of valid values, in the field [rataFrequencyCode] for [RATA].`,
        ]);
      }
    });
  });
});
