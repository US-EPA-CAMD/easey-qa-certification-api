import {forwardRef, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {EaseyException} from '@us-epa-camd/easey-common/exceptions';
import {Logger} from '@us-epa-camd/easey-common/logger';
import {currentDateTime} from '@us-epa-camd/easey-common/utilities/functions';
import {EntityManager, In} from 'typeorm';
import {settlePromises} from '../utilities/constants';
import {v4 as uuid} from 'uuid';

import {
  HgSummaryBaseDTO,
  HgSummaryDTO,
  HgSummaryImportDTO,
} from '../dto/hg-summary.dto';
import {HgSummary} from '../entities/hg-summary.entity';
import {HgInjectionWorkspaceService} from '../hg-injection-workspace/hg-injection-workspace.service';
import {HgSummaryRepository} from '../hg-summary/hg-summary.repository';
import {HgSummaryMap} from '../maps/hg-summary.map';
import {TestSummaryWorkspaceService} from '../test-summary-workspace/test-summary.service';
import {HgSummaryWorkspaceRepository} from './hg-summary-workspace.repository';

@Injectable()
export class HgSummaryWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: HgSummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @Inject(forwardRef(() => HgInjectionWorkspaceService))
    private readonly hgInjectionService: HgInjectionWorkspaceService,
    private readonly repository: HgSummaryWorkspaceRepository,
    private readonly historicalRepo: HgSummaryRepository,
  ) {
  }

  async getHgSummaries(testSumId: string): Promise<HgSummaryDTO[]> {
    const records = await this.repository.find({where: {testSumId}});

    return this.map.many(records);
  }

  async getHgSummary(id: string, testSumId: string): Promise<HgSummaryDTO> {
    const result = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(`Hg Summary record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createHgSummary(
    testSumId: string,
    payload: HgSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
    trx?: EntityManager,
  ): Promise<HgSummaryDTO> {
    const timestamp = currentDateTime();

    const repo = trx ? trx.getRepository(HgSummary) : this.repository;

    let entity = repo.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repo.save(entity);
    entity = await repo.findOneBy({id: entity.id});
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
    return this.map.one(entity);
  }

  async getHgSummaryByTestSumIds(
    testSumIds: string[],
  ): Promise<HgSummaryDTO[]> {
    const results = await this.repository.find({
      where: {testSumId: In(testSumIds)},
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<HgSummaryDTO[]> {
    const hgSummaries = await this.getHgSummaryByTestSumIds(testSumIds);

    const hgInjections = await this.hgInjectionService.export(
      hgSummaries.map(i => i.id),
    );

    hgSummaries.forEach(s => {
      s.hgInjectionData = hgInjections.filter(i => i.hgTestSumId === s.id);
    });

    return hgSummaries;
  }

  async updateHgSummary(
    testSumId: string,
    id: string,
    payload: HgSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<HgSummaryDTO> {
    const timestamp = currentDateTime();

    const repo = trx ? trx.getRepository(HgSummary) : this.repository;

    const entity = await repo.findOneBy({
      id,
      testSumId,
    });

    if (!entity) {
      throw new EaseyException(
        new Error(`Hg Summary record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.gasLevelCode = payload.gasLevelCode;
    entity.meanMeasuredValue = payload.meanMeasuredValue;
    entity.meanReferenceValue = payload.meanReferenceValue;
    entity.percentError = payload.percentError;
    entity.apsIndicator = payload.apsIndicator;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await repo.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );

    return this.map.one(entity);
  }

  async deleteHgSummary(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<void> {
    try {
      const repo = trx ? trx.getRepository(HgSummary) : this.repository;
      await repo.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Hg Summary record [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
  }

  async import(
    testSumId: string,
    payload: HgSummaryImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
    trx?: EntityManager,
  ) {
    const promises = [];
    const isImport = true;
    let historicalRecord: HgSummary;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        gasLevelCode: payload.gasLevelCode,
      });
    }

    const createdHgSummary = await this.createHgSummary(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord?.id,
      trx,
    );

    this.logger.log(
      `Hg Summary Successfully Imported. Record Id: ${createdHgSummary.id}`,
    );

    if (payload.hgInjectionData?.length > 0) {
      for (const hgInjection of payload.hgInjectionData) {
        promises.push(
          this.hgInjectionService.import(
            testSumId,
            createdHgSummary.id,
            hgInjection,
            userId,
            isHistoricalRecord,
            trx,
          ),
        );
      }
    }

    await settlePromises(promises, this.logger);

    return null;
  }
}
