import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TestQualificationBaseDTO,
  TestQualificationDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class TestQualificationWorkspaceService {
  constructor(
    private readonly map: TestQualificationMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(TestQualificationWorkspaceRepository)
    private readonly repository: TestQualificationWorkspaceRepository,
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
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Test Qualification record not found with Record Id [${id}].`,
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
  ): Promise<TestQualificationRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
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

  async deleteTestQualification(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new LoggingException(
        `Error deleting Test Qualification with record Id [${id}]`,
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
    payload: TestQualificationBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<TestQualificationRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOne(testSumId);

    if (!record) {
      throw new LoggingException(
        `A Test Qualification record not found with Record Id [${testSumId}].`,
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
}
