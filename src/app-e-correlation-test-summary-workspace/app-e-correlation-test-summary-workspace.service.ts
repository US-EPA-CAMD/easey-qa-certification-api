import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';
import { AeCorrelationSummaryMap } from 'src/maps/app-e-correlation-summary.map';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryRecordDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class AppECorrelationTestSummaryWorkspaceService {
  constructor(
    private readonly map: AeCorrelationSummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AppendixETestSummaryWorkspaceRepository)
    private readonly repository: AppendixETestSummaryWorkspaceRepository,
  ) {}

  async createAppECorrelation(
    testSumId: string,
    payload: AppECorrelationTestSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
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
}
