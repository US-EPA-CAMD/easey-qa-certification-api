import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import {
  LinearityInjectionImportDTO,
  LinearityInjectionRecordDTO,
} from '../dto/linearity-injection.dto';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

const testSumId = '1';
const linSumId = '1';
const linInjId = '1';
const userId = 'testuser';

const lineInjection = new LinearitySummary();
const lineInjectionDto = new LinearitySummaryDTO();
const lineInjectionRecordDto = new LinearityInjectionRecordDTO();

const payload = new LinearityInjectionImportDTO();

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(lineInjection),
  save: jest.fn().mockResolvedValue(lineInjection),
  findOne: jest.fn().mockResolvedValue(lineInjection),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(lineInjectionDto),
  many: jest.fn().mockResolvedValue([lineInjectionDto]),
});

describe('TestSummaryWorkspaceService', () => {
  let service: LinearityInjectionWorkspaceService;
  let repository: LinearityInjectionWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearityInjectionWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: LinearityInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LinearityInjectionMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    service = module.get(LinearityInjectionWorkspaceService);
    repository = module.get(LinearityInjectionWorkspaceRepository);
    testSummaryService = module.get(TestSummaryWorkspaceService);
  });

  describe('import', () => {
    it('Should import Linearity Injection', async () => {
      jest
        .spyOn(service, 'createInjection')
        .mockResolvedValue(lineInjectionRecordDto);
      const result = await service.import(testSumId, linSumId, payload, userId);
      expect(result).toEqual(null);
    });
  });

  describe('createInjection', () => {
    it('Should insert a Linearity Injection record', async () => {
      const result = await service.createInjection(
        testSumId,
        linSumId,
        payload,
        userId,
      );
      expect(result).toEqual(lineInjectionDto);
    });
  });

  describe('updateInjection', () => {
    it('Should update a Linearity Injection record', async () => {
      const result = await service.updateInjection(
        testSumId,
        linInjId,
        payload,
        userId,
      );
      expect(result).toEqual(lineInjectionDto);
    });

    it('Should through error while updating a Linearity Injection record', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateInjection(testSumId, linInjId, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteInjection', () => {
    it('Should delete a Linearity Injection record', async () => {
      const result = await service.deleteInjection(testSumId, linInjId, userId);
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Linearity Injection record', async () => {
      const error = new InternalServerErrorException(
        `Error deleting Linearity Injection record Id [${linInjId}]`,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteInjection(testSumId, linInjId, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
