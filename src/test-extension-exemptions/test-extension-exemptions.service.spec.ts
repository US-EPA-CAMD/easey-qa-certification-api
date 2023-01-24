import { Test, TestingModule } from '@nestjs/testing';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemption } from '../entities/workspace/test-extension-exemption.entity';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { TestExtensionExemptionsRepository } from './test-extension-exemptions.repository';
import { TestExtensionExemptionsService } from './test-extension-exemptions.service';

const locationId = '121';
const testExtExp = '1';
const facilityId = 1;
const unitId = '121';
const testExtExpId = '1';
const entity = new TestExtensionExemption();
const dto = new TestExtensionExemptionRecordDTO();

const mockRepository = () => ({
  getTestExtensionExemptionById: jest.fn().mockResolvedValue(entity),
  getTestExtensionExemptionsByLocationId: jest.fn().mockResolvedValue([entity]),
  getTestExtensionsByUnitStack: jest.fn().mockResolvedValue([entity]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('TestExtensionExemptionsService', () => {
  let service: TestExtensionExemptionsService;
  let repository: TestExtensionExemptionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestExtensionExemptionsService,
        {
          provide: TestExtensionExemptionMap,
          useFactory: mockMap,
        },
        {
          provide: TestExtensionExemptionsRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TestExtensionExemptionsService>(
      TestExtensionExemptionsService,
    );
    repository = module.get(TestExtensionExemptionsRepository);
  });

  describe('getTestExtensionExemptionById', () => {
    it('calls the repository.getTestExtensionExemptionById() and get test Extension Exemption by id', async () => {
      const result = await service.getTestExtensionExemptionById(testExtExp);
      expect(result).toEqual(dto);
    });

    it('should throw error when Test Extension Exemption not found', async () => {
      jest
        .spyOn(repository, 'getTestExtensionExemptionById')
        .mockResolvedValue(null);

      let errored = false;

      try {
        await service.getTestExtensionExemptionById(testExtExp);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getTestExtensionExemptionsByLocationId', () => {
    it('calls the repository.getTestExtensionExemptionsByLocationId() and get QA Test Extension Exemptions by locationId', async () => {
      const result = await service.getTestExtensionExemptionsByLocationId(
        locationId,
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('getTestExtensions', () => {
    it('calls the repository.getQACertEventsByUnitStack() and get QA Test Extension Exemptions by locationId', async () => {
      const result = await service.getTestExtensions(facilityId, [unitId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export QA Test Extension Exemptions', async () => {
      const returnedSummary = dto;
      returnedSummary.id = testExtExpId;

      const spySummaries = jest
        .spyOn(service, 'getTestExtensions')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([dto]);
    });
  });
});
