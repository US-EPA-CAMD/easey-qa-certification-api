import { Test, TestingModule } from '@nestjs/testing';
import { Rata } from '../entities/rata.entity';
import { RataMap } from '../maps/rata.map';
import { RataDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataRepository } from './rata.repository';
import { RataService } from './rata.service';

const rataId = '';
const rataRecord = new RataRecordDTO();
const rataDto = new RataDTO();
const rataEntity = new Rata();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataDto),
  many: jest.fn().mockResolvedValue([rataDto]),
});

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(rataEntity),
  find: jest.fn().mockResolvedValue([rataEntity]),
});

describe('RataService', () => {
  let service: RataService;
  let repository: RataRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataService,
        {
          provide: RataRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataService>(RataService);
    repository = module.get<RataRepository>(RataRepository);
  });

  describe('getRataById', () => {
    it('calls the repository.findOne() and get one rata record', async () => {
      const result = await service.getRataById(rataId);
      expect(result).toEqual(rataRecord);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should through error while not finding a Rata record', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.getRataById(rataId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getRatasByTestSumId', () => {
    it('calls the repository.find() and get many rata record', async () => {
      const result = await service.getRatasByTestSumId(rataId);
      expect(result).toEqual([rataRecord]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
