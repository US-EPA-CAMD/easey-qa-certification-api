import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { TransmitterTransducerAccuracyWorkspaceRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyImportDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';
import { TransmitterTransducerAccuracy } from '../entities/transmitter-transducer-accuracy.entity';
import { TransmitterTransducerAccuracyRepository } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.repository';
import { In } from 'typeorm';

@Injectable()
export class TransmitterTransducerAccuracyWorkspaceService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TransmitterTransducerAccuracyWorkspaceRepository)
    private readonly repository: TransmitterTransducerAccuracyWorkspaceRepository,
    private readonly map: TransmitterTransducerAccuracyMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(TransmitterTransducerAccuracyRepository)
    private readonly historicalRepository: TransmitterTransducerAccuracyRepository,
  ) {}

  async getTransmitterTransducerAccuracy(
    id: string,
  ): Promise<TransmitterTransducerAccuracyDTO> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new EaseyException(
        new Error(
          `A Transmitter Transducer Accuracy record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(entity);
  }

  async getTransmitterTransducerAccuracies(
    testSumId: string,
  ): Promise<TransmitterTransducerAccuracyDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async getTransmitterTransducerAccuraciesByTestSumIds(
    testSumIds: string[],
  ): Promise<TransmitterTransducerAccuracyDTO[]> {
    const results = await this.repository.find({
      where: {
        testSumId: In(testSumIds),
      },
    });

    return this.map.many(results);
  }

  async createTransmitterTransducerAccuracy(
    testSumId: string,
    payload: TransmitterTransducerAccuracyBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<TransmitterTransducerAccuracyRecordDTO> {
    const timestamp = currentDateTime().toLocaleDateString();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);
    entity = await this.repository.findOne(entity.id);
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async updateTransmitterTransducerAccuracy(
    testSumId: string,
    id: string,
    payload: TransmitterTransducerAccuracyBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<TransmitterTransducerAccuracyDTO> {
    const entity = await this.repository.findOne({ id, testSumId });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Transmitter Transducer Accuracy record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.lowLevelAccuracy = payload.lowLevelAccuracy;
    entity.lowLevelAccuracySpecCode = payload.lowLevelAccuracySpecCode;
    entity.midLevelAccuracy = payload.midLevelAccuracy;
    entity.midLevelAccuracySpecCode = payload.midLevelAccuracySpecCode;
    entity.highLevelAccuracy = payload.highLevelAccuracy;
    entity.highLevelAccuracySpecCode = payload.highLevelAccuracySpecCode;

    const timestamp = currentDateTime();
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async deleteTransmitterTransducerAccuracy(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new EaseyException(
        new Error(
          `Error deleting Transmitter Transducer Accuracy record [${id}].`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async import(
    testSumId: string,
    payload: TransmitterTransducerAccuracyImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    let historicalRecord: TransmitterTransducerAccuracy;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOne({
        testSumId: testSumId,
        lowLevelAccuracy: payload.lowLevelAccuracy,
        lowLevelAccuracySpecCode: payload.lowLevelAccuracySpecCode,
        midLevelAccuracy: payload.midLevelAccuracy,
        midLevelAccuracySpecCode: payload.midLevelAccuracySpecCode,
        highLevelAccuracy: payload.highLevelAccuracy,
        highLevelAccuracySpecCode: payload.highLevelAccuracySpecCode,
      });
    }

    const createdTransmitterTransducerAccuracy = await this.createTransmitterTransducerAccuracy(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Transmitter Transducer Accuracy successfully imported. Record Id: ${createdTransmitterTransducerAccuracy.id}`,
    );

    return null;
  }

  async export(
    testSumIds: string[],
  ): Promise<TransmitterTransducerAccuracyDTO[]> {
    return this.getTransmitterTransducerAccuraciesByTestSumIds(testSumIds);
  }
}
