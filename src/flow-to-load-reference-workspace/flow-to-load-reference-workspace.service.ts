import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceDTO,
  FlowToLoadReferenceImportDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';
import { FlowToLoadReferenceRepository } from '../flow-to-load-reference/flow-to-load-reference.repository';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference-workspace.repository';

@Injectable()
export class FlowToLoadReferenceWorkspaceService {
  constructor(
    private readonly map: FlowToLoadReferenceMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: FlowToLoadReferenceWorkspaceRepository,
    private readonly historicalRepo: FlowToLoadReferenceRepository,
    private readonly logger: Logger,
  ) {}

  async getFlowToLoadReferences(
    testSumId: string,
  ): Promise<FlowToLoadReferenceDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFlowToLoadReference(id: string): Promise<FlowToLoadReferenceDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Flow To Load Reference Workspace record not found with Record Id [${id}].`,
        ),
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
    historicalRecordId?: string,
  ): Promise<FlowToLoadReferenceDTO> {
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
    entity = await this.repository.findOneBy({ id: entity.id });
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
    const timestamp = currentDateTime();

    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Flow To Load Reference Workspace record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.rataTestNumber = payload.rataTestNumber;
    entity.operatingLevelCode = payload.operatingLevelCode;
    entity.averageGrossUnitLoad = payload.averageGrossUnitLoad;
    entity.averageReferenceMethodFlow = payload.averageReferenceMethodFlow;
    entity.referenceFlowLoadRatio = payload.referenceFlowLoadRatio;
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
      throw new EaseyException(
        new Error(`Error deleting Flow To Load Reference record Id [${id}]`),
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

  async import(
    testSumId: string,
    payload: FlowToLoadReferenceImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: FlowToLoadReference;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        operatingLevelCode: payload.operatingLevelCode,
      });
    }

    const createdFlowToLoadReference = await this.createFlowToLoadReference(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Flow To Load Reference Successfully Imported.  Record Id: ${createdFlowToLoadReference.id}`,
    );
  }

  async export(testSumIds: string[]): Promise<FlowToLoadReferenceDTO[]> {
    return this.getFlowToLoadReferenceBySumIds(testSumIds);
  }
}
