import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AirEmissionTestBaseDTO,
  AirEmissionTestRecordDTO,
} from 'src/dto/air-emission-test.dto';
import { AirEmissionTestMap } from '../maps/air-emission-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AirEmissionTestWorkspaceRepository } from './air-emission-test-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AirEmissionTestWorkspaceService {
  constructor(
    private readonly map: AirEmissionTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AirEmissionTestWorkspaceRepository)
    private readonly repository: AirEmissionTestWorkspaceRepository,
  ) {}

  async createAirEmissionTest(
    testSumId: string,
    payload: AirEmissionTestBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AirEmissionTestRecordDTO> {
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
