import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';
import { MatsReportTypeCode } from '../entities/mats-report-type-code.entity';
import { MatsDataSubmissionFileNamesDTO } from '../dto/mats-data-submission-create-payload.dto';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';
import { MatsDataSubmissionChecksService } from './mats-data-submission-checks.service';

jest.mock('class-validator', () => ({
  validate: jest.fn().mockResolvedValue([]),
}));

const mockPayload: MatsDataSubmissionBaseDTO = {
  locationId: 'CBS-6ac708a8-0127-4ef4-806e-9388b544e4ab',
  reportTypeCode: 'NOTIFY',
  averagingGroupCode: 'NONE',
  pollutantCodes: ['FPM'],
  testNumber: '12345',
  testDate: new Date('2025-02-27'),
  testComment: 'THIS IS ANOTHER TEST',
  testMethodCodes: ['2A'],
  year: 2025,
  quarter: 1,
  originalSubmissionId: '2',
  facilityId: 8470,
  monitorPlanId: 'SDM4661-9D60966839D048AD989BDD49DB09CC80',
};
const mockReportTypeCode = (() => {
  const entity = new MatsReportTypeCode();
  entity.code = 'CR';
  entity.description = 'Compliance Report';
  entity.metadataReportTypeCode = 'MATS_CR';
  entity.requiresPollutant = true;
  entity.requiresTestMethod = true;
  entity.enforceAttachmentRules = true;
  return entity;
})();

describe('MatsDataSubmissionChecksService', () => {
  let manager: EntityManager;
  let service: MatsDataSubmissionChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        EntityManager,
        MatsDataSubmissionMap,
        MatsDataSubmissionRepository,
        MatsDataSubmissionService,
        MatsDataSubmissionChecksService,
      ],
    }).compile();

    manager = module.get<EntityManager>(EntityManager);
    service = module.get<MatsDataSubmissionChecksService>(
      MatsDataSubmissionChecksService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runChecks', () => {
    it('should execute checks and return an array of warnings', async () => {
      jest.spyOn(manager, 'findOne').mockResolvedValue(mockReportTypeCode);
      jest.spyOn(manager, 'find').mockResolvedValue([{}]);
      (service as any).validateFiles = jest.fn().mockResolvedValue([]);
      (service as any).reportTypeToPollutantCrosscheck = jest
        .fn()
        .mockResolvedValue([]);
      (service as any).testMethodToPollutantCrosscheck = jest
        .fn()
        .mockResolvedValue([]);
      (service as any).pollutantToTestMethodCrosscheck = jest
        .fn()
        .mockResolvedValue([]);

      const result = await service.runChecks(
        mockPayload,
        {} as MatsDataSubmissionFileNamesDTO,
        'locationId',
      );
      expect(result).toEqual([]);
    });
  });
});
