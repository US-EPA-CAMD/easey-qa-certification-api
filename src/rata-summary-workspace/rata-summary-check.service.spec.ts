import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { RataSummaryImportDTO } from '../dto/rata-summary.dto';

import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummaryChecksService } from './rata-summary-checks.service';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { ReferenceMethodCode } from '../entities/workspace/reference-method-code.entity';
import { ReferenceMethodCodeRepository } from '../reference-method-code/reference-method-code.repository';
import { QAMonitorPlanWorkspaceRepository } from '../qa-monitor-plan-workspace/qa-monitor-plan.repository';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '';
const testSumId = '';
const rataSumId = '';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const monitorSystemRecord = new MonitorSystem();
const mp = new MonitorPlan();
const referenceMethodCode = new ReferenceMethodCode();

const mockTestSumRepository = () => ({
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(null),
  getTestSummaryById: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(null),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSystemRecord),
});

const mockTestSummaryRelationshipRepository = () => ({
  getTestTypeCodesRelationships: jest
    .fn()
    .mockResolvedValue([{ testResultCode: 'PASSED' }]),
});

const mockQAMonitorPlanRepository = () => ({
  getMonitorPlanWithALowerBeginDate: jest.fn().mockResolvedValue([mp]),
});

const mockReferenceMethodCodeRepository = () => ({
  find: jest.fn().mockResolvedValue([referenceMethodCode]),
});

describe('Rata Summary Check Service Test', () => {
  let service: RataSummaryChecksService;
  let repository: RataSummaryWorkspaceRepository;
  let testSumRepository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        RataSummaryChecksService,
        {
          provide: TestSummaryMasterDataRelationshipRepository,
          useFactory: mockTestSummaryRelationshipRepository,
        },
        {
          provide: RataSummaryWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSumRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: QAMonitorPlanWorkspaceRepository,
          useFactory: mockQAMonitorPlanRepository,
        },
        {
          provide: ReferenceMethodCodeRepository,
          useFactory: mockReferenceMethodCodeRepository,
        },
      ],
    }).compile();

    service = module.get(RataSummaryChecksService);
    repository = module.get(RataSummaryWorkspaceRepository);
    testSumRepository = module.get(TestSummaryWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('IMPORT-30 (Result A)', () => {
    const payload = new RataSummaryImportDTO();
    (payload.co2OrO2ReferenceMethodCode = ''),
      payload.stackDiameter == 2,
      payload.stackArea == 2,
      payload.numberOfTraversePoints == 1,
      (payload.calculatedWAF = 1),
      (payload.defaultWAF = 1);

    it('Should get Result A', async () => {
      const testSummary = new TestSummary();
      testSummary.testTypeCode = TestTypeCodes.RATA;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(testSumRepository, 'getTestSummaryById')
        .mockResolvedValue(testSummary);
      try {
        await service.runChecks(testSumId, payload);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }

      try {
        await service.runChecks(
          locationId,
          payload,
          false,
          false,
          rataSumId,
          testSumId,
          [payload],
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
