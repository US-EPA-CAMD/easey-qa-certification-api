import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { UnitDefaultTestRunRecordDTO } from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRun } from '../entities/unit-default-test-run.entity';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { UnitDefaultTestRunRepository } from './unit-default-test-run.repository';
import { UnitDefaultTestRunService } from './unit-default-test-run.service';

const id = '';
const unitDefaultTestSumId = '';

const entity = new UnitDefaultTestRun();
const dto = new UnitDefaultTestRunRecordDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('UnitDefaultTestRunService', () => {
  let service: UnitDefaultTestRunService;
  let repository: UnitDefaultTestRunRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        UnitDefaultTestRunService,
        {
          provide: UnitDefaultTestRunRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitDefaultTestRunMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitDefaultTestRunService>(UnitDefaultTestRunService);
    repository = module.get<UnitDefaultTestRunRepository>(
      UnitDefaultTestRunRepository,
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
