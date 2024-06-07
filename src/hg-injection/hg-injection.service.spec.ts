import { Test, TestingModule } from '@nestjs/testing';

import { HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjection } from '../entities/hg-injection.entity';
import { HgInjectionMap } from '../maps/hg-injection.map';
import { HgInjectionRepository } from './hg-injection.repository';
import { HgInjectionService } from './hg-injection.service';

const hgTestSumId = '';
const entity = new HgInjection();
const dto = new HgInjectionDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('HgInjectionService', () => {
  let service: HgInjectionService;
  let repository: HgInjectionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HgInjectionService,
        {
          provide: HgInjectionRepository,
          useFactory: mockRepository,
        },
        {
          provide: HgInjectionMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<HgInjectionService>(HgInjectionService);
    repository = module.get<HgInjectionRepository>(HgInjectionRepository);
  });

  describe('getHgInjections', () => {
    it('Should return Hg Injection records by Test Injection id', async () => {
      const result = await service.getHgInjectionsByHgTestSumId(hgTestSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getHgInjection', () => {
    it('Should return a Hg Injection record', async () => {
      const result = await service.getHgInjection(hgTestSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Hg Injection record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getHgInjection(hgTestSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('getHgInjectionsByHgSumIds', () => {
    it('Should get Hg Injection records by Hg Summary Ids', async () => {
      const result = await service.getHgInjectionsByHgSumIds([hgTestSumId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Hg Injection record', async () => {
      jest.spyOn(service, 'getHgInjectionsByHgSumIds').mockResolvedValue([]);

      const result = await service.export([hgTestSumId]);
      expect(result).toEqual([]);
    });
  });
});
