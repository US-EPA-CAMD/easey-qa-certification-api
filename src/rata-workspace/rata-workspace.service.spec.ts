import { Test, TestingModule } from '@nestjs/testing';
import { Rata } from '../entities/workspace/rata.entity';
import { RataBaseDTO, RataDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataMap } from '../maps/rata.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataWorkspaceService } from './rata-workspace.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { HttpStatus } from '@nestjs/common';

const rataDto = new RataDTO();

const locId = '';
const testSumId = '';
const rataId = '';
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
  find: jest.fn().mockResolvedValue([rataEntity]),
  create: jest.fn().mockResolvedValue(rataEntity),
  save: jest.fn().mockResolvedValue(rataEntity),
  findOne: jest.fn().mockResolvedValue(rataEntity),
  delete: jest.fn().mockResolvedValue(null),
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

  describe('createRata', () => {
    it('calls the repository.create() and insert a rata record', async () => {
      const result = await service.createRata(testSumId, payload, userId);
      expect(result).toEqual(rataRecord);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('updateRata', () => {
    it('should update a rata record', async () => {
      const result = await service.updateRata(
        testSumId,
        rataId,
        payload,
        userId,
      );
      expect(result).toEqual(rataRecord);
    });

    it('should throw error with invalid rata record id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateRata(testSumId, rataId, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteRata', () => {
    it('Should delete a Rata record', async () => {
      const result = await service.deleteRata(testSumId, rataId, userId);
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Rata record', async () => {
      const error = new LoggingException(
        `Error deleting RATA with record Id [${rataId}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteRata(testSumId, rataId, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
