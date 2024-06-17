import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In, IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  TestQualificationBaseDTO,
  TestQualificationDTO,
  TestQualificationImportDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { TestQualification } from '../entities/test-qualification.entity';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestQualificationRepository } from '../test-qualification/test-qualification.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';

@Injectable()
export class TestQualificationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: TestQualificationMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: TestQualificationWorkspaceRepository,
    private readonly historicalRepo: TestQualificationRepository,
  ) {}

  async getTestQualifications(
    testSumId: string,
  ): Promise<TestQualificationDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async getTestQualification(id: string): Promise<TestQualificationDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Test Qualification record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createTestQualification(
    testSumId: string,
    payload: TestQualificationBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<TestQualificationRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);

    await this.repository.save(entity);

    entity = await this.repository.findOneBy({ id: entity.id });

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async deleteTestQualification(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Test Qualification with record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async updateTestQualification(
    testSumId: string,
    id: string,
    payload: TestQualificationBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<TestQualificationRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOneBy({ id });

    if (!record) {
      throw new EaseyException(
        new Error(
          `A Test Qualification record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    record.testClaimCode = payload.testClaimCode;
    record.beginDate = payload.beginDate;
    record.endDate = payload.endDate;
    record.highLoadPercentage = payload.highLoadPercentage;
    record.midLoadPercentage = payload.midLoadPercentage;
    record.lowLoadPercentage = payload.lowLoadPercentage;
    record.userId = userId;
    record.updateDate = timestamp;

    await this.repository.save(record);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(record);
  }

  async getTestQualificationByTestSumIds(
    testSumIds: string[],
  ): Promise<TestQualificationDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<TestQualificationDTO[]> {
    return this.getTestQualificationByTestSumIds(testSumIds);
  }

  async import(
    testSumId: string,
    payload: TestQualificationImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: TestQualification;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        testClaimCode: payload.testClaimCode,
        highLoadPercentage: payload.highLoadPercentage ?? IsNull(),
      });
    }

    const createdTestQualification = await this.createTestQualification(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Test Qualification Successfully Imported.  Record Id: ${createdTestQualification.id}`,
    );
  }
}
