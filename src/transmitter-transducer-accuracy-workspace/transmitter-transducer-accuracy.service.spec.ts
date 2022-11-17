import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { TransmitterTransducerAccuracyWorkspaceService } from './transmitter-transducer-accuracy.service';
import { TransmitterTransducerAccuracyWorkspaceRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracy } from '../entities/workspace/transmitter-transducer-accuracy.entity';
import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

const testSumID = 'TEST-SUM-ID';
const userID = 'USER-ID';
const entity: TransmitterTransducerAccuracy = new TransmitterTransducerAccuracy();
const baseDTO: TransmitterTransducerAccuracyBaseDTO = new TransmitterTransducerAccuracyBaseDTO();
const recordDTO: TransmitterTransducerAccuracyRecordDTO = new TransmitterTransducerAccuracyRecordDTO();

const mockRepo = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn(),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(recordDTO),
  many: jest.fn().mockResolvedValue([recordDTO]),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('TransmitterTransducerAccuracyWorkspaceService', () => {
  let service: TransmitterTransducerAccuracyWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repo: TransmitterTransducerAccuracyWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransmitterTransducerAccuracyWorkspaceService,
        {
          provide: TransmitterTransducerAccuracyWorkspaceRepository,
          useFactory: mockRepo,
        },
        {
          provide: TransmitterTransducerAccuracyMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
      ],
    }).compile();

    service = module.get<TransmitterTransducerAccuracyWorkspaceService>(
      TransmitterTransducerAccuracyWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repo = module.get<TransmitterTransducerAccuracyWorkspaceRepository>(
      TransmitterTransducerAccuracyWorkspaceRepository,
    );
  });

  describe('createTransmitterTransducerAccuracy', () => {
    it('Should call repository to save a new record and return a DTO', async () => {
      const result = await service.createTransmitterTransducerAccuracy(
        testSumID,
        baseDTO,
        userID,
        false,
        null,
      );
      expect(result).toEqual(recordDTO);
    });
  });

  describe('updateCalibrationInjection', () => {
    it('Should update and return the Transmitter Transducer Accuracy record', async () => {
      const result = await service.updateTransmitterTransducerAccuracy(
        testSumID,
        entity.id,
        baseDTO,
        userID,
      );

      expect(result).toEqual(recordDTO);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when a Transmitter Transducer Accuracy record not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.updateTransmitterTransducerAccuracy(
          testSumID,
          entity.id,
          baseDTO,
          userID,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteTransmitterTransducerAccuracy', () => {
    it('Should delete a Transmitter Transducer Accuracy record', async () => {
      const result = await service.deleteTransmitterTransducerAccuracy(
        testSumID,
        entity.id,
        userID,
      );

      expect(result).toEqual(undefined);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when database throws an error while deleting a Transmitter Transducer Accuracy record', async () => {
      jest
        .spyOn(repo, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteTransmitterTransducerAccuracy(
          testSumID,
          entity.id,
          userID,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
