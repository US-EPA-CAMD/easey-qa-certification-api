import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime, withTransaction } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { AirEmissionTestingRepository } from '../air-emission-testing/air-emission-testing.repository';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingDTO,
  AirEmissionTestingImportDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTesting } from '../entities/air-emission-test.entity';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';

@Injectable()
export class AirEmissionTestingWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: AirEmissionTestingMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: AirEmissionTestingWorkspaceRepository,
    private readonly historicalRepo: AirEmissionTestingRepository,
  ) {}

  async getAirEmissionTestings(
    testSumId: string,
  ): Promise<AirEmissionTestingRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getAirEmissionTesting(
    id: string,
  ): Promise<AirEmissionTestingRecordDTO> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `An Air Emission Testing record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(entity);
  }

  async createAirEmissionTesting(
    testSumId: string,
    payload: AirEmissionTestingBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
    trx?: EntityManager,
  ): Promise<AirEmissionTestingRecordDTO> {
    const timestamp = currentDateTime();

    const repository = withTransaction(this.repository, trx);

    let entity = repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repository.save(entity);
    entity = await repository.findOneBy({ id: entity.id });
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
    return this.map.one(entity);
  }

  async updateAirEmissionTesting(
    testSumId: string,
    id: string,
    payload: AirEmissionTestingBaseDTO,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<AirEmissionTestingRecordDTO> {
    const timestamp = currentDateTime();
    const repository = withTransaction(this.repository, trx);
    const entity = await repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `An Air Emission Testing record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.qiLastName = payload.qiLastName;
    entity.qiFirstName = payload.qiFirstName;
    entity.qiMiddleInitial = payload.qiMiddleInitial;
    entity.aetbName = payload.aetbName;
    entity.aetbPhoneNumber = payload.aetbPhoneNumber;
    entity.aetbEmail = payload.aetbEmail;
    entity.examDate = payload.examDate;
    entity.providerName = payload.providerName;
    entity.providerEmail = payload.providerEmail;

    entity.userId = userId;
    entity.updateDate = timestamp;

    await repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );

    return this.getAirEmissionTesting(id);
  }

  async deleteAirEmissionTesting(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<void> {
    const repository = withTransaction(this.repository, trx);

    try {
      await repository.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Air Emission Testing with record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
  }

  async getAirEmissionTestingByTestSumIds(
    testSumIds: string[],
  ): Promise<AirEmissionTestingDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<AirEmissionTestingDTO[]> {
    return this.getAirEmissionTestingByTestSumIds(testSumIds);
  }

  async import(
    testSumId: string,
    payload: AirEmissionTestingImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
    trx?: EntityManager,
  ) {
    const isImport = true;
    let historicalRecord: AirEmissionTesting;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        qiLastName: payload.qiLastName,
        qiFirstName: payload.qiFirstName,
        aetbName: payload.aetbName,
        examDate: payload.examDate,
      });
    }

    const createdAirEmissionTesting = await this.createAirEmissionTesting(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
      trx,
    );

    this.logger.log(
      `Air Emission Testing Successfully Imported.  Record Id: ${createdAirEmissionTesting.id}`,
    );
  }
}
