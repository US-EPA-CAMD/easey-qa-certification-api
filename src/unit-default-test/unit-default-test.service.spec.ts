import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestRunService } from '../unit-default-test-run/unit-default-test-run.service';
import { UnitDefaultTestRunDTO } from '../dto/unit-default-test-run.dto';
import {
  UnitDefaultTestDTO,
  UnitDefaultTestRecordDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { UnitDefaultTestRepository } from './unit-default-test.repository';
import { UnitDefaultTestService } from './unit-default-test.service';

const id = '';
const testSumId = '';

const entity = new UnitDefaultTest();
const dto = new UnitDefaultTestRecordDTO();

const unitDefaultTestRunDto = new UnitDefaultTestRunDTO();
unitDefaultTestRunDto.unitDefaultTestSumId = 'ID';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockUnitDefaultTestRunService = () => ({
  export: jest.fn().mockResolvedValue([unitDefaultTestRunDto]),
});

describe('UnitDefaultTestService', () => {
  let service: UnitDefaultTestService;
  let repository: UnitDefaultTestRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitDefaultTestService,
        {
          provide: UnitDefaultTestRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitDefaultTestMap,
          useFactory: mockMap,
        },
        {
          provide: UnitDefaultTestRunService,
          useFactory: mockUnitDefaultTestRunService,
        },
      ],
    }).compile();

    service = module.get<UnitDefaultTestService>(UnitDefaultTestService);
    repository = module.get<UnitDefaultTestRepository>(
      UnitDefaultTestRepository,
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
      const result = await service.getUnitDefaultTest(id, testSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a UnitDefaultTest record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getUnitDefaultTest(id, testSumId);
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

      jest
        .spyOn(service, 'getUnitDefaultTestsByTestSumIds')
        .mockResolvedValue([exportDto]);

      const result = await service.export([testSumId]);
      exportDto.unitDefaultTestRunData = [unitDefaultTestRunDto];
      expect(result).toEqual([exportDto]);
    });
  });
});
