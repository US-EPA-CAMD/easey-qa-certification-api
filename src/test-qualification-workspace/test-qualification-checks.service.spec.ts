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

const locationId = '';
const testSumId = '';
const testSumRecord = new TestSummaryImportDTO();
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

const mockRepository = () => {
  find: jest.fn().mockResolvedValue(testQualificationRecords);
};

describe('TestQualificationChecksService', () => {
  let service: TestQualificationChecksService;
  let repository: TestQualificationWorkspaceRepository;
  let monitorSystemRepository: MonitorSystemRepository;

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
    repository = module.get(TestQualificationWorkspaceRepository);
    monitorSystemRepository = module.get(MonitorSystemRepository);

    jest.spyOn(service, 'getErrorMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Test Qualification Checks', () => {
    it('Should pass all checks', async () => {
      const result = await service.runChecks(
        locationId,
        payload,
        testQualificationRecords,
        testSumId,
        testSumRecord,
        rata,
      );
      expect(result).toEqual([]);
    });
  });
});
