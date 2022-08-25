import { Test, TestingModule } from '@nestjs/testing';
import { RataRunDTO } from '../dto/rata-run.dto';
import { RataRunController } from './rata-run.controller';
import { RataRunService } from './rata-run.service';

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const rataId = 'g7h8i9';
const rataSumId = 'j0k1l2';
const rataRunId = 'm3n4o5';

const rataRunDTO: RataRunDTO = new RataRunDTO();
const rataRuns: RataRunDTO[] = [rataRunDTO];

const mockRataRunService = () => ({
  getRataRun: jest.fn().mockResolvedValue(rataRunDTO),
  getRataRuns: jest.fn().mockResolvedValue(rataRuns),
});

describe('RataRunController', () => {
  let controller: RataRunController;
  let service: RataRunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataRunController],
      providers: [
        {
          provide: RataRunService,
          useFactory: mockRataRunService,
        },
      ],
    }).compile();

    controller = module.get<RataRunController>(RataRunController);
    service = module.get<RataRunService>(RataRunService);
  });

  describe('getRataRun', () => {
    it('Calls the repository to get one Rata Run record by Id', async () => {
      const result = await controller.getRataRun(
        locId,
        testSumId,
        rataId,
        rataSumId,
        rataRunId,
      );
      expect(result).toEqual(rataRunDTO);
      expect(service.getRataRun).toHaveBeenCalled();
    });
  });

  describe('getRataRuns', () => {
    it('Calls the repository to get all Rata Run records for a Rata Summary Id', async () => {
      const result = await controller.getRataRuns(
        locId,
        testSumId,
        rataId,
        rataSumId,
      );
      expect(result).toEqual(rataRuns);
      expect(service.getRataRuns).toHaveBeenCalled();
    });
  });
});
