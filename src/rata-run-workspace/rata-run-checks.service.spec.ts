import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataRunChecksService } from './rata-run-checks.service';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { RataRunBaseDTO, RataRunImportDTO } from '../dto/rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataSummaryWorkspaceRepository } from '../rata-summary-workspace/rata-summary-workspace.repository';
import { RataRun } from '../entities/workspace/rata-run.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestSummaryRepository } from '../test-summary/test-summary.repository';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '';
const testSumId = '';
const rataRunId = '';
const rataSumId = '';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const monitorSystemRecord = new MonitorSystem();
let testSumRecord = {
  system: {
    systemTypeCode: 'FLOW',
  },
};

const importPayload = new RataRunImportDTO();
importPayload.runNumber = 999;
importPayload.beginMinute = 0;
importPayload.endMinute = 30;
importPayload.cemValue = 1000;
importPayload.rataReferenceValue = 1000;
importPayload.runStatusCode = 'RUNUSED';

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
});

const mockTestSummaryRepository = () => ({
  findOne: jest.fn().mockResolvedValue(testSumRecord),
});
const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSystemRecord),
});
const mockRataSummaryWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(rataSumId),
});
const mockRataRunWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(rataRunId),
});

describe('Rata Run Check Service Test', () => {
  let service: RataRunChecksService;
  let rataSummaryRepository: RataSummaryWorkspaceRepository;
  let repository: RataRunWorkspaceRepository;
  let testSummaryRepository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        RataRunChecksService,
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSumRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: TestSummaryRepository,
          useFactory: mockTestSummaryRepository,
        },
        {
          provide: RataSummaryWorkspaceRepository,
          useFactory: mockRataSummaryWorkspaceRepository,
        },
        {
          provide: RataRunWorkspaceRepository,
          useFactory: mockRataRunWorkspaceRepository,
        },
      ],
    }).compile();

    service = module.get(RataRunChecksService);
    rataSummaryRepository = module.get(RataSummaryWorkspaceRepository);
    repository = module.get(RataRunWorkspaceRepository);
    testSummaryRepository = module.get(TestSummaryWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('RATA-101 RATA Run Values Valid', () => {
    it('Should get [RATA-101-A] error', async () => {
      importPayload.cemValue = 1;
      importPayload.rataReferenceValue = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.runChecks(
          importPayload,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
    it('Should get [RATA-101-B] error', async () => {
      importPayload.cemValue = 0;
      importPayload.rataReferenceValue = 0;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.runChecks(
          importPayload,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
  describe('RATA-108 Duplicate RATA Run', () => {
    it('Should get [RATA-108-A] error', async () => {
      const payload = new RataRunBaseDTO();
      payload.runNumber = 4;

      const returnValue = new RataRun();
      payload.runNumber = 4;

      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);
      try {
        await service.runChecks(payload, locationId, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
  });
  describe('RATA-130 RATA Run valid for HG', () => {
    it('Should get [RATA-130-A] error', async () => {
      importPayload.endMinute = 0;

      try {
        await service.runChecks(
          importPayload,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
    it('Should get [RATA-130-B] error', async () => {
      importPayload.endMinute = 0;

      try {
        await service.runChecks(
          importPayload,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
