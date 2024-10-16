import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunRecordDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRun as UnitDefaultTestRunOfficial } from '../entities//unit-default-test-run.entity';
import { UnitDefaultTestRun } from '../entities/workspace/unit-default-test-run.entity';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestRunRepository } from '../unit-default-test-run/unit-default-test-run.repository';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';

const id = '';
const testSumId = '';
const unitDefaultTestSumId = '';
const userId = 'user';

const payload = new UnitDefaultTestRunBaseDTO();

const entity = new UnitDefaultTestRun();
const dto = new UnitDefaultTestRunRecordDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
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
  findOneBy: jest.fn().mockResolvedValue(new UnitDefaultTestRunOfficial()),
});

describe('UnitDefaultTestRunWorkspaceService', () => {
  let service: UnitDefaultTestRunWorkspaceService;
  let repository: UnitDefaultTestRunWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
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
          provide: UnitDefaultTestRunRepository,
          useFactory: mockOfficialRepository,
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

  describe('getUnitDefaultTestRuns', () => {
    it('Should return UnitDefaultTestRun records by Unit Default Test Summary id', async () => {
      const result = await service.getUnitDefaultTestRuns(unitDefaultTestSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getUnitDefaultTestRun', () => {
    it('Should return a UnitDefaultTestRun record', async () => {
      const result = await service.getUnitDefaultTestRun(
        id,
        unitDefaultTestSumId,
      );

      expect(result).toEqual(dto);
    });

    it('Should throw error when a UnitDefaultTestRun record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getUnitDefaultTestRun(id, unitDefaultTestSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
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

  describe('updateUnitDefaultTestRun', () => {
    it('should update a Unit Default Test Run record', async () => {
      const result = await service.updateUnitDefaultTestRun(
        testSumId,
        id,
        payload,
        userId,
      );
      expect(result).toEqual(dto);
    });

    it('should throw error with invalid Unit Default Test Run', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateUnitDefaultTestRun(testSumId, id, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteUnitDefaultTestRun', () => {
    it('Should delete a Unit Default Test Run record', async () => {
      const result = await service.deleteUnitDefaultTestRun(
        testSumId,
        id,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('Should throw an error while deleting a Unit Default Test Run record', async () => {
      const error = new EaseyException(
        new Error(
          `Error deleting Unit Default Test Run with record Id [${testSumId}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteUnitDefaultTestRun(testSumId, id, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getUnitDefaultTestRunByUnitDefaultTestSumIds', () => {
    it('Should get Unit Default Test Run records by unitDefaultTestSumIds', async () => {
      const result = await service.getUnitDefaultTestRunByUnitDefaultTestSumIds(
        [unitDefaultTestSumId],
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Unit Default Test Run record', async () => {
      jest
        .spyOn(service, 'getUnitDefaultTestRunByUnitDefaultTestSumIds')
        .mockResolvedValue([]);

      const result = await service.export([unitDefaultTestSumId]);
      expect(result).toEqual([]);
    });
  });
});
