import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestRun } from '../entities/workspace/unit-default-test-run.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';
import { Logger } from '@us-epa-camd/easey-common/logger';

const testSumId = '';
const unitDefaultTestSumId ='';
const userId = 'user';

const payload = new UnitDefaultTestRunBaseDTO();

const entity = new UnitDefaultTestRun();
const dto = new UnitDefaultTestRunDTO();

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('UnitDefaultTestRunWorkspaceService', () => {
  let service: UnitDefaultTestRunWorkspaceService;
  let repository: UnitDefaultTestRunWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        UnitDefaultTestRunWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: UnitDefaultTestRunWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitDefaultTestRunMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitDefaultTestRunWorkspaceService>(
      UnitDefaultTestRunWorkspaceService,
    );
    repository = module.get<UnitDefaultTestRunWorkspaceRepository>(
      UnitDefaultTestRunWorkspaceRepository,
    );
  });

  describe('createUnitDefaultTestRun', () => {
    it('Should create and return a new Unit Default Test Run record', async () => {
      const result = await service.createUnitDefaultTestRun(
        testSumId,
        unitDefaultTestSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('Should create and return a new Unit Default Test Run record with Historical Record Id', async () => {
      const result = await service.createUnitDefaultTestRun(
        testSumId,
        unitDefaultTestSumId,
        payload,
        userId,
        false,
        'historicalId',
      );

      expect(result).toEqual(dto);
    });
  });
});
