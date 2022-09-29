import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunRecordDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AppECorrelationTestRunWorkspaceService {
  constructor(
    private readonly map: AppECorrelationTestRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AppECorrelationTestRunWorkspaceRepository)
    private readonly repository: AppECorrelationTestRunWorkspaceRepository,
  ) {}

  async createAppECorrelationTestRun(
    testSumId: string,
    appECorrTestSumId: string,
    payload: AppECorrelationTestRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AppECorrelationTestRunRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      appECorrTestSumId,
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
