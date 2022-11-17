import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '../utilities/functions';
import { TransmitterTransducerAccuracyWorkspaceRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';

@Injectable()
export class TransmitterTransducerAccuracyWorkspaceService {
  constructor(
    @InjectRepository(TransmitterTransducerAccuracyWorkspaceRepository)
    private readonly repository: TransmitterTransducerAccuracyWorkspaceRepository,
    private readonly map: TransmitterTransducerAccuracyMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getTransmitterTransducerAccuracy(
    id: string,
  ): Promise<TransmitterTransducerAccuracyDTO> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `A Transmitter Transducer Accuracy record not found with Record Id [${id}].`,
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
      throw new LoggingException(
        `Transmitter Transducer Accuracy record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.lowLevelAccuracy = payload.lowLevelAccuracy;
    entity.lowLevelAccuracySpecCode = payload.lowLevelAccuracySpecCode;
    entity.midLevelAccuracy = payload.midLevelAccuracy;
    entity.midLevelAccuracySpecCode = payload.midLevelAccuracySpecCode;
    entity.highLevelAccuracy = payload.highLevelAccuracy;
    entity.highLevelAccuracySpecCode = payload.highLevelAccuracySpecCode;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }
}
