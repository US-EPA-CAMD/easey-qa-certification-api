import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTest } from '../entities/workspace/unit-default-test.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestRecordDTO,
  UnitDefaultTestImportDTO,
  UnitDefaultTestDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { HttpStatus } from '@nestjs/common';
import { UnitDefaultTest as UnitDefaultTestOfficial } from '../entities/unit-default-test.entity';
import { UnitDefaultTestRepository } from '../unit-default-test/unit-default-test.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunWorkspaceService } from '../unit-default-test-run-workspace/unit-default-test-run.service';

const id = '';
const testSumId = '';
const userId = 'user';

const payload = new UnitDefaultTestBaseDTO();
const importPayload = new UnitDefaultTestImportDTO();

const entity = new UnitDefaultTest();
const dto = new UnitDefaultTestRecordDTO();

const unitDefaultTestRunDto = new UnitDefaultTestRunDTO();
unitDefaultTestRunDto.unitDefaultTestSumId = 'ID';

const historicalUnitDefaulTest = new UnitDefaultTestOfficial();
historicalUnitDefaulTest.id = 'HISTORICAL-ID';

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

const mockOfficialRepository = () => ({
  findOne: jest.fn().mockResolvedValue(historicalUnitDefaulTest),
});

const mockUnitDefaultTestRunService = () => ({
  export: jest.fn().mockResolvedValue([unitDefaultTestRunDto]),
  import: jest.fn().mockResolvedValue(null),
});

describe('UnitDefaultTestWorkspaceService', () => {
  let service: UnitDefaultTestWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: UnitDefaultTestWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
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
        {
          provide: UnitDefaultTestRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: UnitDefaultTestRunWorkspaceService,
          useFactory: mockUnitDefaultTestRunService,
        },
      ],
    }).compile();

    service = module.get<UnitDefaultTestWorkspaceService>(
      UnitDefaultTestWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<UnitDefaultTestWorkspaceRepository>(
      UnitDefaultTestWorkspaceRepository,
    );
  });

  describe('getUnitDefaultTests', () => {
    it('Should return UnitDefaultTest records by Test Summary id', async () => {
      const result = await service.getUnitDefaultTests(testSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getUnitDefaultTest', () => {
    it('Should return a UnitDefaultTest record', async () => {
      const result = await service.getUnitDefaultTest(id);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a UnitDefaultTest record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getUnitDefaultTest(id);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createUnitDefaultTest', () => {
    it('Should create and return a new Unit Default Test record', async () => {
      const result = await service.createUnitDefaultTest(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
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

  describe('updateUnitDefaultTest', () => {
    it('should update a Unit Default Test record', async () => {
      const result = await service.updateUnitDefaultTest(
        testSumId,
        id,
        payload,
        userId,
      );
      expect(result).toEqual(dto);
    });

    it('should throw error with invalid Unit Default Test', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateUnitDefaultTest(testSumId, id, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteUnitDefaultTest', () => {
    it('Should delete a Unit Default Test record', async () => {
      const result = await service.deleteUnitDefaultTest(testSumId, id, userId);
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Unit Default Test record', async () => {
      const error = new LoggingException(
        `Error deleting Unit Default Test with record Id [${testSumId}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteUnitDefaultTest(testSumId, id, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getUnitDefaultTestsByTestSumIds', () => {
    it('Should get Unit Default Test records by test sum ids', async () => {
      const result = await service.getUnitDefaultTestsByTestSumIds([testSumId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Unit Default Test Record', async () => {
      const exportDto = new UnitDefaultTestDTO();
      exportDto.id = 'ID';
      exportDto.unitDefaultTestRunData = [unitDefaultTestRunDto];

      jest
        .spyOn(service, 'getUnitDefaultTestsByTestSumIds')
        .mockResolvedValue([exportDto]);

      const result = await service.export([testSumId]);
      expect(result).toEqual([exportDto]);
    });
  });

  describe('import', () => {
    importPayload.noxDefaultRate = 1;

    it('Should import Unit Default Test', async () => {
      jest.spyOn(service, 'createUnitDefaultTest').mockResolvedValue(dto);

      const result = await service.import(testSumId, importPayload, userId);

      expect(result).toEqual(null);
    });

    it('Should import Unit Default Test from historical record', async () => {
      jest.spyOn(service, 'createUnitDefaultTest').mockResolvedValue(dto);

      importPayload.unitDefaultTestRunData = [
        new UnitDefaultTestRunImportDTO(),
      ];

      const result = await service.import(
        testSumId,
        importPayload,
        userId,
        true,
      );

      expect(result).toEqual(null);
    });
  });
});
