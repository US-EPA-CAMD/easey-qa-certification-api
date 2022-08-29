import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TestQualificationBaseDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TestQualificationWorkspaceService {
  constructor(
    private readonly map: TestQualificationMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(TestQualificationWorkspaceRepository)
    private readonly repository: TestQualificationWorkspaceRepository,
  ) {}

  async createTestQualification(
    testSumId: string,
    payload: TestQualificationBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<TestQualificationRecordDTO> {
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
