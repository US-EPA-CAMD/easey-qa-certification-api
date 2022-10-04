import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { currentDateTime } from '../utilities/functions';
import {
  AppEHeatInputFromGasBaseDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas.repository';
import { TestSummaryWorkspaceService } from 'src/test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class AppEHeatInputFromGasWorkspaceService {
  constructor(
    private readonly map: AppEHeatInputFromGasMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AppEHeatInputFromGasWorkspaceRepository)
    private readonly repository: AppEHeatInputFromGasWorkspaceRepository,
  ) {}

  async getAppEHeatInputFromGases(
    appEHeatInputFromGasId: string,
  ): Promise<AppEHeatInputFromGasBaseDTO[]> {
    const records = await this.repository.find({
      where: { appEHeatInputFromGasId },
    });

    return this.map.many(records);
  }

  async getAppEHeatInputFromGas(
    id: string,
  ): Promise<AppEHeatInputFromGasBaseDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input From Gas record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createAppEHeatInputFromGas(
    testSumId: string,
    appECorrelationTestRunId: string,
    payload: AppEHeatInputFromGasBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      id: uuid(),
      appECorrelationTestRunId,
      ...payload,
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
