import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTest } from '../entities/workspace/unit-default-test.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';

const testSumId = '';
const userId = 'user';

const payload = new UnitDefaultTestBaseDTO();

const entity = new UnitDefaultTest();
const dto = new UnitDefaultTestDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('UnitDefaultTestWorkspaceService', () => {
  let service: UnitDefaultTestWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitDefaultTestWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: UnitDefaultTestWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitDefaultTestMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitDefaultTestWorkspaceService>(
      UnitDefaultTestWorkspaceService,
    );
  });

  describe('createUnitDefaultTest', () => {
    it('Should create and return a new Unit Default Test record', async () => {
      const result = await service.createUnitDefaultTest(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('Should create and return a new Unit Default Test record with Historical Record Id', async () => {
      const result = await service.createUnitDefaultTest(
        testSumId,
        payload,
        userId,
        false,
        'historicalId',
      );

      expect(result).toEqual(dto);
    });
  });
});
