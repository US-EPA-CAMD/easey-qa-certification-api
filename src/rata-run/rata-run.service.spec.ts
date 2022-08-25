import { Test, TestingModule } from '@nestjs/testing';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunRepository } from './rata-run.repository';
import { RataRunService } from './rata-run.service';
import { RataRun } from '../entities/rata-run.entity';
import { RataRunDTO } from '../dto/rata-run.dto';

const rataRunId = 'a1b2c3';
const rataSumId = 'd4e5f6';
const rataRun = new RataRun();
const rataRunDTO = new RataRunDTO();

const payload: RataRunDTO = {
  id: 'a1b2c3',
  rataSummaryId: 'd4e5f6',
  runNumber: 1,
  beginDate: new Date(),
  beginHour: 12,
  beginMinute: 30,
  endDate: new Date(),
  endHour: 18,
  endMinute: 15,
  cemValue: 13,
  rataReferenceValue: 11,
  grossUnitLoad: 7,
  runStatusCode: '',
};

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataRunDTO),
  many: jest.fn().mockResolvedValue([rataRunDTO]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([rataRun]),
  findOne: jest.fn().mockResolvedValue(rataRun),
});

describe('RataRunService', () => {
  let service: RataRunService;
  let repository: RataRunRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataRunService,
        RataRunMap,
        {
          provide: RataRunRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataRunMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataRunService>(RataRunService);
    repository = module.get<RataRunRepository>(RataRunRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRataRun', () => {
    it('Calls repository.findOne({id}) to get a single Rata Run record', async () => {
      const result = await service.getRataRun(rataRunId);
      expect(result).toEqual(rataRunDTO);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getRataRun(rataRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getRataRuns', () => {
    it('Should return an array of Rata Run records', async () => {
      const result = await service.getRataRuns(rataSumId);
      expect(result).toEqual([rataRun]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
