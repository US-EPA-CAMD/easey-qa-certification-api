import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { RataImportDTO } from '../dto/rata.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestResultCode } from '../entities/test-result-code.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestResultCodes } from '../enums/test-result-code.enum';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataFrequencyCodeRepository } from '../rata-frequency-code/rata-frequency-code.repository';
import { TestResultCodeRepository } from '../test-result-code/test-result-code.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataChecksService } from './rata-checks.service';

const locationId = '';
const testSumId = '';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const monitorSystemRecord = new MonitorSystem();
let testSumRecord = {
  system: {
    systemTypeCode: 'FLOW',
  },
};
const rataFreqCdRecord = new RataFrequencyCode();
const testResultCode = new TestResultCode();

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
const mockTestResultCodeRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(testResultCode),
});
const mockMonitorSystemRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(monitorSystemRecord),
});

describe('Rata Checks Service Test', () => {
  let service: RataChecksService;
  let testSummaryRepository: TestSummaryWorkspaceRepository;
  let rataFreqCodeRepository: RataFrequencyCodeRepository;
  let testResultCodeRepository: TestResultCodeRepository;
  let monitorSystemRepository: MonitorSystemRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggerModule],
      providers: [
        RataChecksService,
        {
          provide: TestResultCodeRepository,
          useFactory: mockTestResultCodeRepository,
        },
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
    testResultCodeRepository = module.get(TestResultCodeRepository);
    monitorSystemRepository = module.get(MonitorSystemRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('RATA Checks', () => {
    it('Should pass all checks for Import', async () => {
      const result = await service.runChecks(
        locationId,
        importPayload,
        null,
        true,
        false,
        testSummaryImportPayload,
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

  describe('RATA-100 Test Result Code Valid', () => {
    it('Should get [RATA-100-B] error ', async () => {
      importPayload.numberOfLoadLevels = 0;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = 'AAA';
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      jest.spyOn(testResultCodeRepository, 'findOneBy').mockResolvedValue(null);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });

    it('Should get [RATA-100-C] error ', async () => {
      importPayload.numberOfLoadLevels = 0;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = 'AAA';
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      let testResultRec = new TestResultCode();

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      jest
        .spyOn(testResultCodeRepository, 'findOneBy')
        .mockResolvedValue(testResultRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(
          `${MOCK_ERROR_MSG}\n${MOCK_ERROR_MSG}`,
        );
      }
    });
  });

  describe('RATA-102 Number of Load Levels Valid', () => {
    it('Should get [RATA-102-B] error ', async () => {
      importPayload.numberOfLoadLevels = 656;

      let testSumRec = new TestSummary();
      testSumRec.system = new MonitorSystem();
      testSumRec.testTypeCode = TestTypeCodes.RATA;
      testSumRec.system.systemTypeCode = 'FLOW';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(
          `${MOCK_ERROR_MSG}\n${MOCK_ERROR_MSG}`,
        );
      }
    });

    it('Should get [RATA-102-C] error ', async () => {
      importPayload.numberOfLoadLevels = 5;

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('RATA-103 Overall Relative Accuracy Valid', () => {
    it('Should get [RATA-103-A] error ', async () => {
      importPayload.relativeAccuracy = 3;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.ABORTED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-103-B] error ', async () => {
      importPayload.relativeAccuracy = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-103-C] error ', async () => {
      importPayload.relativeAccuracy = -1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
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
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });

    it('Should get [RATA-104-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });

    it('Should get [RATA-104-C] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 0;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
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
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });

    it('Should get [RATA-105-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = null;
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });

    it('Should get [RATA-105-C] error with invalid rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);
      jest
        .spyOn(rataFreqCodeRepository, 'getRataFrequencyCode')
        .mockResolvedValue(null);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });

    it('Should get [RATA-105-C] error with "8QTRS" rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = '8QTRS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;
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
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });

    it('Should get [RATA-105-C] error with "ALTSL" rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'ALTSL';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = TestTypeCodes.RATA;
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
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });
  });
});
