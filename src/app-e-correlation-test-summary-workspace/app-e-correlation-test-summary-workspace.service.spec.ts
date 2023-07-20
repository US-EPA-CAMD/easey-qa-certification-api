import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunWorkspaceService } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.service';
import { AppendixETestSummaryRepository } from '../app-e-correlation-test-summary/app-e-correlation-test-summary.repository';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryDTO,
  AppECorrelationTestSummaryRecordDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { ConfigService } from '@nestjs/config';

const locationId = '5';
const testSumId = '';
const userId = 'user';
const appendixECorrelationTestSummaryId = '';
const entity = new AppECorrelationTestSummary();
const appECorrelationTest = new AppECorrelationTestSummaryDTO();
const appECorrelationTests = [appECorrelationTest];

const payload = new AppECorrelationTestSummaryBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appECorrelationTest),
  many: jest.fn().mockResolvedValue(appECorrelationTests),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockTestRunService = () => ({
  import: jest.fn(),
  export: jest.fn().mockResolvedValue([new AppECorrelationTestRunDTO()]),
});

const mockOfficialRepository = () => ({
  findOne: jest.fn(),
});

describe('AppECorrelationTestSummaryWorkspaceService', () => {
  let service: AppECorrelationTestSummaryWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: AppendixETestSummaryWorkspaceRepository;
  let officialRepository: AppendixETestSummaryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        AppECorrelationTestSummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppECorrelationTestRunWorkspaceService,
          useFactory: mockTestRunService,
        },
        {
          provide: AppendixETestSummaryRepository,
          useFactory: mockTestSumService,
        },
        {
          provide: AppendixETestSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppECorrelationTestSummaryMap,
          useFactory: mockMap,
        },
        {
          provide: AppendixETestSummaryRepository,
          useFactory: mockOfficialRepository,
        },
      ],
    }).compile();

    service = module.get<AppECorrelationTestSummaryWorkspaceService>(
      AppECorrelationTestSummaryWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<AppendixETestSummaryWorkspaceRepository>(
      AppendixETestSummaryWorkspaceRepository,
    );
    officialRepository = module.get<AppendixETestSummaryRepository>(
      AppendixETestSummaryRepository,
    );
  });

  describe('createAppECorrelation', () => {
    it('Calls the service to create a new Appendix E Correlation Test Summary record', async () => {
      const result = await service.createAppECorrelation(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(appECorrelationTest);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    describe('editAppECorrelation', () => {
      it('should update an Appendix E Correlation Test Summary record', async () => {
        const result = await service.editAppECorrelation(
          testSumId,
          appendixECorrelationTestSummaryId,
          payload,
          userId,
        );
        expect(result).toEqual(appECorrelationTest);
      });

      it('should throw error with invalid Appendix E Correlation Test Summary', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

        let errored = false;
        try {
          await service.editAppECorrelation(
            testSumId,
            appendixECorrelationTestSummaryId,
            payload,
            userId,
          );
        } catch (e) {
          errored = true;
        }
        expect(errored).toEqual(true);
      });
    });
  });

  describe('import', () => {
    const importDTO = new AppECorrelationTestSummaryDTO();
    const recordDTO = new AppECorrelationTestSummaryRecordDTO();

    it('Should Import Appendix E Correlation Test Summary', async () => {
      jest.spyOn(service, 'createAppECorrelation').mockResolvedValue(recordDTO);

      await service.import(locationId, testSumId, importDTO, userId, false);
    });

    it('Should Import Appendix E Correlation Test Summary from Historical Record', async () => {
      importDTO.appECorrelationTestRunData = [new AppECorrelationTestRunDTO()];

      jest.spyOn(service, 'createAppECorrelation').mockResolvedValue(recordDTO);

      await service.import(locationId, testSumId, importDTO, userId, true);
    });
  });

  describe('getAppECorrelationsByTestSumIds', () => {
    it('Should get Appendix E Correlation Test Summary records by test sum ids', async () => {
      const result = await service.getAppECorrelationsByTestSumIds([testSumId]);
      expect(result).toEqual([appECorrelationTest]);
    });
  });

  describe('Export', () => {
    it('Should Export Appendix E Correlation Test Summary', async () => {
      jest
        .spyOn(service, 'getAppECorrelationsByTestSumIds')
        .mockResolvedValue([appECorrelationTest]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([appECorrelationTest]);
    });
  });

  describe('deleteAppECorrelation', () => {
    it('Should delete an Appendix E Correlation Test Summary record', async () => {
      const result = await service.deleteAppECorrelation(
        testSumId,
        appendixECorrelationTestSummaryId,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('Should throw error while deleting an Appendix E Correlation Test Summary record', async () => {
      const error = new EaseyException(
        new Error(
          `Error Appendix E Correlation Test Summary with record Id [${appendixECorrelationTestSummaryId}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteAppECorrelation(
          testSumId,
          appendixECorrelationTestSummaryId,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
