import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AirEmissionTestingWorkspaceService {
  constructor(
    private readonly map: AirEmissionTestingMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AirEmissionTestingWorkspaceRepository)
    private readonly repository: AirEmissionTestingWorkspaceRepository,
  ) {}

  async createAirEmissionTesting(
    testSumId: string,
    payload: AirEmissionTestingBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AirEmissionTestingRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
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
