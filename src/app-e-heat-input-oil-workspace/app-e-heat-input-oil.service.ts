import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AppEHeatInputOilWorkspaceRepository } from './app-e-heat-input-oil.repository';
import { AppEHeatInputOilMap } from '../maps/app-e-heat-input-oil-map';
import { AppEHeatInputOilBaseDTO,
         AppEHeatInputOilDTO,
         AppEHeatInputOilRecordDTO } from '../dto/app-e-heat-input-oil.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class AppEHeatInputOilWorkspaceService {
  constructor(
    @InjectRepository(AppEHeatInputOilWorkspaceRepository)
    private readonly repository: AppEHeatInputOilWorkspaceRepository,
    private readonly map: AppEHeatInputOilMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService
  ) {}

  async getAppEHeatInputOilRecords(aeCorrTestRunId: string): Promise<AppEHeatInputOilDTO[]> {
    const records = await this.repository.find({
      where: { aeCorrTestRunId },
    });

    return this.map.many(records);
  }

  async getAppEHeatInputOilRecord(id: string): Promise<AppEHeatInputOilDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input Oil record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createAppEHeatInputOilRecord(
    testSumId: string,
    aeCorrTestRunId: string,
    payload: AppEHeatInputOilBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AppEHeatInputOilRecordDTO> {
    const timestamp = currentDateTime().toLocaleDateString();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      aeCorrTestRunId,
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
