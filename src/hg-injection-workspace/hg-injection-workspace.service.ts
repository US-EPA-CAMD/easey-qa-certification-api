import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { v4 as uuid } from 'uuid';
import {
  HgInjectionBaseDTO,
  HgInjectionDTO,
  HgInjectionImportDTO,
  HgInjectionRecordDTO,
} from '../dto/hg-injection.dto';
import { HgInjectionWorkspaceRepository } from './hg-injection-workspace.repository';
import { HgInjectionMap } from '../maps/hg-injection.map';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { HgInjection } from '../entities/hg-injection.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { HgInjectionRepository } from '../hg-injection/hg-injection.repository';

@Injectable()
export class HgInjectionWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: HgInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(HgInjectionWorkspaceRepository)
    private readonly repository: HgInjectionWorkspaceRepository,

    @InjectRepository(HgInjectionRepository)
    private readonly historicalRepository: HgInjectionRepository,
  ) {}

  async getHgInjectionsByHgTestSumId(hgTestSumId: string) {
    const records = await this.repository.find({ where: { hgTestSumId } });

    return this.map.many(records);
  }

  async getHgInjection(id: string) {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new EaseyException(
        new Error(`Hg Injeciton record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createHgInjection(
    testSumId: string,
    hgTestSumId: string,
    payload: HgInjectionBaseDTO | HgInjectionImportDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<HgInjectionRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ?? uuid(),
      hgTestSumId,
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

  async updateHgInjection(
    testSumId: string,
    id: string,
    payload: HgInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<HgInjectionRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new EaseyException(
        new Error(`Hg Injection record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.injectionDate = payload.injectionDate;
    entity.injectionHour = payload.injectionHour;
    entity.injectionMinute = payload.injectionMinute;
    entity.measuredValue = payload.measuredValue;
    entity.referenceValue = payload.referenceValue;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async deleteHgInjection(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({ id });
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting HG Injection record Id [${id}]`),
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

  async getHgInjectionsByHgSumIds(
    hgSumIds: string[],
  ): Promise<HgInjectionDTO[]> {
    const results = await this.repository.find({
      where: { hgTestSumId: In(hgSumIds) },
    });

    return this.map.many(results);
  }

  async export(hgSumIds: string[]): Promise<HgInjectionDTO[]> {
    return await this.getHgInjectionsByHgSumIds(hgSumIds);
  }

  async import(
    testSumId: string,
    hgTestSumId: string,
    payload: HgInjectionImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    let historicalRecord: HgInjection;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOne({
        hgTestSumId: hgTestSumId,
        injectionDate: payload.injectionDate,
        injectionHour: payload.injectionHour,
        injectionMinute: payload.injectionMinute,
      });
    }

    await this.createHgInjection(
      testSumId,
      hgTestSumId,
      payload,
      userId,
      isImport,
      historicalRecord?.id,
    );
  }
}
