import { Test, TestingModule } from '@nestjs/testing';
import { RataRunBaseDTO, RataRunDTO } from '../dto/rata-run.dto';
import { RataRunWorkspaceController } from './rata-run.controller';
import { RataRunWorkspaceService } from './rata-run.service';

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const rataId = 'g7h8i9';
const rataSumId = 'j0k1l2';
const rataRunId = 'm3n4o5';

const payload: RataRunBaseDTO = {
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
  runStatusCode: 'NOTUSED',
};

const rataRunDTO: RataRunDTO = new RataRunDTO();
const rataRuns: RataRunDTO[] = [rataRunDTO];

const mockRataRunWorkspaceService = () => ({
  updateRataRun: jest.fn().mockResolvedValue(rataRunDTO),
  getRataRun: jest.fn().mockResolvedValue(rataRunDTO),
  getRataRuns: jest.fn().mockResolvedValue(rataRuns),
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

  describe('updateRataRun', () => {
    it('should call the RataRunService.updateRataRun and update rata run record', async () => {
      expect(
        await controller.updateRataRun(
          locId,
          testSumId,
          rataId,
          rataSumId,
          rataRunId,
          payload,
        ),
      ).toEqual(rataRunDTO);
      expect(service.updateRataRun).toHaveBeenCalled();
    });
  });
});
