import { v4 as uuid } from 'uuid';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { currentDateTime } from '../utilities/functions';
import { RataBaseDTO, RataDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataMap } from '../maps/rata.map';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataSummaryWorkspaceService } from '../rata-summary-workspace/rata-summary-workspace.service';
import { In } from 'typeorm';

@Injectable()
export class RataWorkspaceService {
  constructor(
    private readonly map: RataMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(RataWorkspaceRepository)
    private readonly repository: RataWorkspaceRepository,

    private readonly rataSummaryService: RataSummaryWorkspaceService,
  ) {}

  async getRataById(id: string): Promise<RataDTO> {
    const result = await this.repository.findOne({
      id: id,
    });

    if (!result) {
      throw new LoggingException(
        `A RATA record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getRatasByTestSumId(testSumId: string): Promise<RataDTO[]> {
    const results = await this.repository.find({
      testSumId: testSumId,
    });
    return this.map.many(results);
  }

  async createRata(
    testSumId: string,
    payload: RataBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataRecordDTO> {
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

  async updateRata(
    testSumId: string,
    id: string,
    payload: RataBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `A RATA record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.numberOfLoadLevels = payload.numberOfLoadLevels;
    entity.relativeAccuracy = payload.relativeAccuracy;
    entity.rataFrequencyCode = payload.rataFrequencyCode;
    entity.overallBiasAdjustmentFactor = payload.overallBiasAdjustmentFactor;
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

  async deleteRata(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new LoggingException(
        `Error deleting RATA with record Id [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getRatasByTestSumIds(testSumIds: string[]): Promise<RataDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<RataDTO[]> {
    const ratas = await this.getRatasByTestSumIds(testSumIds);

    const rataSummaries = await this.rataSummaryService.export(
      ratas.map(i => i.id),
    );

    ratas.forEach(s => {
      s.rataSummaryData = rataSummaries.filter(i => i.rataId === s.id);
    });

    return ratas;
  }
}
