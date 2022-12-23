import { Test, TestingModule } from '@nestjs/testing';
import { HgInjection } from 'src/entities/hg-injection.entity';
import { HgInjectionMap } from 'src/maps/hg-injection.map';
import { HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjectionRepository } from './hg-injection.repository';
import { HgInjectionService } from './hg-injection.service';

const id = '';
const hgTestSumId = '';
const entity = new HgInjection();
const dto = new HgInjectionDTO();

const hgInjDto = new HgInjectionDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
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
      const result = await service.getHgInjections(hgTestSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getHgInjection', () => {
    it('Should return a Hg Injection record', async () => {
      const result = await service.getHgInjection(id, hgTestSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Hg Injection record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getHgInjection(id, hgTestSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
