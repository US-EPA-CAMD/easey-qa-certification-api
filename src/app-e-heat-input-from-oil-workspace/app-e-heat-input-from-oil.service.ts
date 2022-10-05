import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  AppEHeatInputFromOilBaseDTO,
  AppEHeatInputFromOilRecordDTO,
} from 'src/dto/app-e-heat-input-from-oil.dto';

@Injectable()
export class AppEHeatInputFromOilWorkspaceService {
  constructor(
    @InjectRepository(AppEHeatInputFromOilWorkspaceRepository)
    private readonly repository: AppEHeatInputFromOilWorkspaceRepository,
    private readonly map: AppEHeatInputFromOilMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getAppEHeatInputFromOilRecords(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromOilRecordDTO[]> {
    const records = await this.repository.find({
      where: { appECorrTestRunId },
    });

    return this.map.many(records);
  }

  async getAppEHeatInputFromOilRecord(
    id: string,
  ): Promise<AppEHeatInputFromOilRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input from Oil record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createAppEHeatInputFromOilRecord(
    testSumId: string,
    appECorrTestRunId: string,
    payload: AppEHeatInputFromOilBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AppEHeatInputFromOilRecordDTO> {
    const timestamp = currentDateTime().toLocaleDateString();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      appECorrTestRunId,
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
