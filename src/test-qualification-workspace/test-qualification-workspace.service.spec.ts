import { HttpStatus } from '@nestjs/common/enums';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestQualificationBaseDTO,
  TestQualificationDTO,
  TestQualificationImportDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { TestQualification } from '../entities/workspace/test-qualification.entity';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestQualificationRepository } from '../test-qualification/test-qualification.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

const testSumId = '';
const testQualificationId = 'a1b2c3';
const userId = 'user';
const entity = new TestQualification();
const testQualificationRecord = new TestQualificationDTO();
const testQualifications = [testQualificationRecord];
const record = new TestQualificationRecordDTO();

const payload: TestQualificationBaseDTO = {
  testClaimCode: 'SLC',
  beginDate: new Date(),
  endDate: new Date(),
  highLoadPercentage: 0,
  midLoadPercentage: 0,
  lowLoadPercentage: 0,
};

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(testQualificationRecord),
  many: jest.fn().mockResolvedValue(testQualifications),
});

const mockHistoricalRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(testQualificationRecord),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('TestQualificationWorkspaceService', () => {
  let service: TestQualificationWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: TestQualificationWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        TestQualificationWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: TestQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: TestQualificationRepository,
          useFactory: mockHistoricalRepository,
        },
        {
          provide: TestQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<TestQualificationWorkspaceService>(
      TestQualificationWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<TestQualificationWorkspaceRepository>(
      TestQualificationWorkspaceRepository,
    );
  });

  describe('createTestQualification', () => {
    it('Should create and return a new Test Qualification record', async () => {
      const result = await service.createTestQualification(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(testQualificationRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('getTestQualification', () => {
    it('Calls repository.findOneBy({id}) to get a single Test Qualification record', async () => {
      const result = await service.getTestQualification(testQualificationId);
      expect(result).toEqual(testQualificationRecord);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Test Qualification record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getTestQualification(testQualificationId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getTestQualifications', () => {
    it('Calls Repository to find all Test Qualification records for a given Test Summary ID', async () => {
      const results = await service.getTestQualifications(testSumId);
      expect(results).toEqual(testQualifications);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('deleteTestQualification', () => {
    it('Should delete a Test Qualification record', async () => {
      const result = await service.deleteTestQualification(
        testSumId,
        testQualificationId,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Test Qualification record', async () => {
      const error = new EaseyException(
        new Error(
          `Error deleting Test Qualification with record Id [${testSumId}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteTestQualification(
          testSumId,
          testQualificationId,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('updateTestQualification', () => {
    it('should update a test qualification record', async () => {
      const result = await service.updateTestQualification(
        testSumId,
        'testQualId',
        payload,
        userId,
      );
      expect(result).toEqual(record);
    });

    it('should throw error with invalid test qualification record id', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateTestQualification(
          testSumId,
          'testQualId',
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('Export', () => {
    it('Should Export Test Qualification', async () => {
      jest
        .spyOn(service, 'getTestQualificationByTestSumIds')
        .mockResolvedValue([testQualificationRecord]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([testQualificationRecord]);
    });
  });

  describe('Import', () => {
    it('Should Import Test Qualification', async () => {
      jest
        .spyOn(service, 'createTestQualification')
        .mockResolvedValue(testQualificationRecord);

      await service.import(
        testSumId,
        new TestQualificationImportDTO(),
        userId,
        true,
      );
    });
  });
});
