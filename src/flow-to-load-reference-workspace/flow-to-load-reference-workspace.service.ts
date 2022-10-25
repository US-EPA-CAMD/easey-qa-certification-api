import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference-workspace.repository';
import {
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceDTO,
} from '../dto/flow-to-load-reference.dto';
import { In } from 'typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class FlowToLoadReferenceWorkspaceService {
  constructor(
    private readonly map: FlowToLoadReferenceMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FlowToLoadReferenceWorkspaceRepository)
    private readonly repository: FlowToLoadReferenceWorkspaceRepository,
  ) {}

  async getFlowToLoadReferences(
    testSumId: string,
  ): Promise<FlowToLoadReferenceDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFlowToLoadReference(id: string): Promise<FlowToLoadReferenceDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Flow To Load Reference Workspace record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createFlowToLoadReference(
    testSumId: string,
    payload: FlowToLoadReferenceBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FlowToLoadReferenceDTO> {
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

  async editFlowToLoadReference(
    testSumId: string,
    id: string,
    payload: FlowToLoadReferenceBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FlowToLoadReferenceDTO> {
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.getFlowToLoadReference(id);

    entity.rataTestNumber = payload.rataTestNumber;
    entity.operatingLevelCode = payload.operatingLevelCode;
    entity.averageGrossUnitLoad = payload.averageGrossUnitLoad;
    entity.averageReferenceMethodFlow = payload.averageReferenceMethodFlow;
    entity.referenceFlowToLoadRatio = payload.referenceFlowToLoadRatio;
    entity.averageHourlyHeatInputRate = payload.averageHourlyHeatInputRate;
    entity.referenceGrossHeatRate = payload.referenceGrossHeatRate;
    entity.calculatedSeparateReferenceIndicator =
      payload.calculatedSeparateReferenceIndicator;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getFlowToLoadReference(id);
  }

  async deleteFlowToLoadReference(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new LoggingException(
        `Error deleting Flow To Load Reference record Id [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getFlowToLoadReferenceBySumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadReferenceDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FlowToLoadReferenceDTO[]> {
    return this.getFlowToLoadReferenceBySumIds(testSumIds);
  }
}
