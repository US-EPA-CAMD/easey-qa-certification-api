import { Test, TestingModule } from '@nestjs/testing';
import { RataRunDTO } from '../dto/rata-run.dto';
import { RataRunWorkspaceController } from './rata-run.controller';
import { RataRunWorkspaceService } from './rata-run.service';

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const rataId = 'g7h8i9';
const rataSumId = 'j0k1l2';
const rataRunId = 'm3n4o5';

const rataRunDTO: RataRunDTO = new RataRunDTO();
const rataRuns: RataRunDTO[] = [rataRunDTO];

const payload: RataRunDTO = {
  id: 'a1b2c3',
  rataSumId: 'd4e5f6',
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
  flowRataRunData: [],
  calculatedRataReferenceValue: 0,
  userId: '',
  addDate: '',
  updateDate: '',
};

const mockRataRunWorkspaceService = () => ({
  getRataRun: jest.fn().mockResolvedValue(rataRunDTO),
  getRataRuns: jest.fn().mockResolvedValue(rataRuns),
  createRataRun: jest.fn().mockResolvedValue(rataRunDTO),
});

describe('RataRunWorkspaceController', () => {
  let controller: RataRunWorkspaceController;
  let service: RataRunWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataRunWorkspaceController],
      providers: [
        {
          provide: RataRunWorkspaceService,
          useFactory: mockRataRunWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<RataRunWorkspaceController>(
      RataRunWorkspaceController,
    );
    service = module.get<RataRunWorkspaceService>(RataRunWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

  describe('createRataRun', () => {
    it('Calls the service to create a new Rata Run record', async () => {
      const result = await controller.createRataRun(
        locId,
        testSumId,
        rataId,
        rataSumId,
        payload,
      );
      expect(result).toEqual(rataRunDTO);
      expect(service.createRataRun).toHaveBeenCalled();
    });
  });
});
