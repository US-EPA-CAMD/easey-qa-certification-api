import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import {
  RataSummaryBaseDTO,
  RataSummaryDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class RataSummaryWorkspaceService {
  constructor(
    private readonly map: RataSummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(RataSummaryWorkspaceRepository)
    private readonly repository: RataSummaryWorkspaceRepository,
  ) {}

  async getRataSummaries(
    testSumId: string,
    rataId: string,
  ): Promise<RataSummaryDTO[]> {
    const records = await this.repository.find({
      where: { testSumId, rataId },
    });

    return this.map.many(records);
  }

  async getRataSummary(id: string): Promise<RataSummaryDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Rata Summary workspace record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createRataSummary(
    testSumId: string,
    rataId: string,
    payload: RataSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataSummaryRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      rataId,
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
}
