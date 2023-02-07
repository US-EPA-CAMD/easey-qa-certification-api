import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSystemRecordDTO } from '../dto/monitor-system.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestQualificationChecksService } from './test-qualification-checks.service';
import {
  TestQualificationBaseDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { RataImportDTO } from '../dto/rata.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestQualification } from '../entities/workspace/test-qualification.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';

const locationId = '';
const testSumId = '';
const testSumRecord = new TestSummaryImportDTO();
testSumRecord.testTypeCode = TestTypeCodes.RATA;
const monitorSystemRecord = new MonitorSystemRecordDTO();
const testQualificationRecord = new TestQualificationRecordDTO();
const testQualificationRecords = [testQualificationRecord];
const payload = new TestQualificationBaseDTO();
const rata = new RataImportDTO();
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const mockTestSummaryRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSumRecord),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockRejectedValue(monitorSystemRecord),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([])
});

describe('TestQualificationChecksService', () => {
  let service: TestQualificationChecksService;
  let repository: TestQualificationWorkspaceRepository;
  let monitorSystemRepository: MonitorSystemRepository;
  let testSummaryRepository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestQualificationChecksService,
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSummaryRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: TestQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(TestQualificationChecksService);
    repository = module.get<TestQualificationWorkspaceRepository>(TestQualificationWorkspaceRepository);
    monitorSystemRepository = module.get(MonitorSystemRepository);
    testSummaryRepository = module.get(TestSummaryWorkspaceRepository);

    jest.spyOn(service, 'getErrorMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Test Qualification Checks', () => {
    it('Should pass all checks', async () => {

      payload.testClaimCode = 'SLC'

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);

      const result = await service.runChecks(
        locationId,
        payload,
        testQualificationRecords,
        testSumId,
        testSumRecord,
        rata,
        true
      );
      expect(result).toEqual([]);
    });
  });

  describe('RATA-9 Single-Level Claim High Load Percentage Valid', () => {
    it('Should get [RATA-9-E] error', async () => {
      payload.testClaimCode = 'NOTSLC'
      payload.highLoadPercentage = 1;

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })
  });

  describe('RATA-10 Single-Level Claim Mid Load Percentage Valid', () => {
    it('Should get [RATA-10-E] error', async () => {
      payload.testClaimCode = 'NOTSLC'
      payload.midLoadPercentage = 1;

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })
  });

  describe('RATA-11 Single-Level Claim Low Load Percentage Valid', () => {
    it('Should get [RATA-11-E] error', async () => {
      payload.testClaimCode = 'NOTSLC'
      payload.lowLoadPercentage = 1;

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })
  });

  describe('RATA-118 Test Claim Code Valid', () => {
    it('Should get [RATA-118-B] error', async () => {
      payload.testClaimCode = 'NOTSLC'

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })

    it('Should get [RATA-118-C] error', async () => {
      payload.testClaimCode = 'SLC'

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'NOTFLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })

    it('Should also get [RATA-118-C] error', async () => {
      payload.testClaimCode = 'ORE'

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'NOTFLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })

    it('Should get [RATA-118-D] error', async () => {
      payload.testClaimCode = 'SLC'
      rata.numberOfLoadLevels = 3;

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })

    it('Should get [RATA-118-D] error', async () => {
      payload.testClaimCode = 'NLE'
      rata.numberOfLoadLevels = 3;

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })

    it('Should get [RATA-118-E] error', async () => {
      payload.testClaimCode = 'ORE'
      rata.numberOfLoadLevels = 3;

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })
  });

  describe('RATA-119 Single-Level Claim Begin Date Valid', () => {
    it('Should get [RATA-119-B] error', async () => {
      payload.testClaimCode = 'SLC'
      payload.beginDate = new Date('1990-01-01')

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })
  });

  describe('RATA-120 Single-Level Claim End Date Valid', () => {
    it('Should get [RATA-120-B] error', async () => {
      payload.testClaimCode = 'SLC'
      payload.endDate = new Date('2020-01-01')

      let testSumRec = new TestSummary();
      testSumRecord.beginDate = new Date('2000-01-01')

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })

    it('Should get [RATA-120-C] error', async () => {
      payload.testClaimCode = 'SLC'
      payload.endDate = new Date('2020-01-01')

      let testSumRec = new TestSummary();
      testSumRecord.beginDate = new Date('2020-01-01')

      const returnValue = new TestQualification();
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    })
  });

  describe('RATA-121 Duplicate Test Claim', () => {
    it('Should get [RATA-121-A] error', async () => {
      payload.testClaimCode = 'thesame'

      let testSumRec = new TestSummary();
      testSumRec.testTypeCode = TestTypeCodes.RATA;

      const returnValue = new TestQualification();
      returnValue.testClaimCode = 'thesame'
      jest.spyOn(repository, 'find').mockResolvedValue([returnValue]);

      const monSysRec = new MonitorSystem();
      monSysRec.systemTypeCode = 'FLOW'
      jest.spyOn(monitorSystemRepository, 'findOne').mockResolvedValue(monSysRec);
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, payload, testQualificationRecords, testSumId, testSumRecord, rata);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    })
  });
});
