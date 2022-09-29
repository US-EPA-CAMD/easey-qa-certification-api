import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestRecordDTO,
} from 'src/dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestMap } from 'src/maps/fuel-flow-to-load-test.map';
import { TestSummaryWorkspaceService } from 'src/test-summary-workspace/test-summary.service';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FuelFlowToLoadTestWorkspaceService {
  constructor(
    private readonly map: FuelFlowToLoadTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FuelFlowToLoadTestWorkspaceRepository)
    private readonly repository: FuelFlowToLoadTestWorkspaceRepository,
  ) {}

  async createFuelFlowToLoadTest(
    testSumId: string,
    payload: FuelFlowToLoadTestBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
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
