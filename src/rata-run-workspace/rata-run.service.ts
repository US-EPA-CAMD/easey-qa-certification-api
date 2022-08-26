import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RataRunWorkspaceRepository } from './rata-run.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RataRunMap } from '../maps/rata-run.map';
import {
  RataRunBaseDTO,
  RataRunDTO,
  RataRunRecordDTO,
} from '../dto/rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class RataRunWorkspaceService {
  constructor(
    @InjectRepository(RataRunWorkspaceRepository)
    private readonly repository: RataRunWorkspaceRepository,
    private readonly map: RataRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getRataRuns(rataSumId: string): Promise<RataRunDTO[]> {
    const records = await this.repository.find({ where: { rataSumId } });

    return this.map.many(records);
  }

  async getRataRun(id: string): Promise<RataRunDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Rata Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createRataRun(
    testSumId: string,
    rataSumId: string,
    payload: RataRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataRunRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      rataSumId,
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

  async updateRataRun(
    testSumId: string,
    rataRunId: string,
    payload: RataRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataRunRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOne(rataRunId);

    if (!record) {
      throw new LoggingException(
        `A Rata Run record not found with Record Id [${rataRunId}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    record.runNumber = payload.runNumber;
    record.beginDate = payload.beginDate;
    record.beginHour = payload.beginHour;
    record.beginMinute = payload.beginMinute;
    record.endDate = payload.endDate;
    record.endHour = payload.endHour;
    record.endMinute = payload.endMinute;
    record.cemValue = payload.cemValue;
    record.rataReferenceValue = payload.rataReferenceValue;
    record.grossUnitLoad = payload.grossUnitLoad;
    record.runStatusCode = payload.runStatusCode;
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
