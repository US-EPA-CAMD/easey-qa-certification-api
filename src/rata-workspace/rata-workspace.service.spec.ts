import { Test, TestingModule } from '@nestjs/testing';
import { Rata } from '../entities/workspace/rata.entity';
import { RataBaseDTO, RataDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataMap } from '../maps/rata.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataWorkspaceService } from './rata-workspace.service';

const rataDto = new RataDTO();

const locId = '';
const testSumId = '';
const userId = 'testUser';
const rataEntity = new Rata();
const rataRecord = new RataRecordDTO();

const payload: RataBaseDTO = {
  rataFrequencyCode: 'OS',
  relativeAccuracy: 0,
  overallBiasAdjustmentFactor: 0,
  numberLoadLevel: 0,
};

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(rataEntity),
  save: jest.fn().mockResolvedValue(rataEntity),
  findOne: jest.fn().mockResolvedValue(rataEntity),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataDto),
  many: jest.fn().mockResolvedValue([rataDto]),
});

describe('RataWorkspaceService', () => {
  let service: RataWorkspaceService;
  let repository: RataWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: RataWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataWorkspaceService>(RataWorkspaceService);
    repository = module.get<RataWorkspaceRepository>(RataWorkspaceRepository);
  });

  describe('createRata', () => {
    it('calls the repository.create() and insert a rata record', async () => {
      const result = await service.createRata(testSumId, payload, userId);
      expect(result).toEqual(rataRecord);
      expect(repository.create).toHaveBeenCalled();
    });
  });
});
