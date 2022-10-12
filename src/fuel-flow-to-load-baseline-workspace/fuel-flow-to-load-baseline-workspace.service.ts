import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadBaselineWorkspaceRepository } from './fuel-flow-to-load-baseline-workspace.repository';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class FuelFlowToLoadBaselineWorkspaceService {
  constructor(
    private readonly map: FuelFlowToLoadBaselineMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FuelFlowToLoadBaselineWorkspaceRepository)
    private readonly repository: FuelFlowToLoadBaselineWorkspaceRepository,
  ) {}

  async getFuelFlowToLoadBaselines(
    testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowToLoadBaseline(
    id: string,
    testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Fuel Flow To Load Baseline record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createFuelFlowToLoadBaseline(
    testSumId: string,
    payload: FuelFlowToLoadBaselineBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FuelFlowToLoadBaselineDTO> {
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
