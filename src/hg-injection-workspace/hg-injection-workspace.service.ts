import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { HgInjectionBaseDTO, HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjectionWorkspaceRepository } from './hg-injection-workspace.repository';
import { HgInjectionMap } from '../maps/hg-injection.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class HgInjectionWorkspaceService {
  constructor(
    private readonly map: HgInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(HgInjectionWorkspaceRepository)
    private readonly repository: HgInjectionWorkspaceRepository,
  ) {}

  async getHgInjectionsByHgTestSumId(hgTestSumId: string) {
    const records = await this.repository.find({ where: { hgTestSumId } });

    return this.map.many(records);
  }

  async getHgInjection(id: string) {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Hg Injeciton record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createHgInjection(
    testSumId: string,
    hgTestSumId: string,
    payload: HgInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<HgInjectionDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
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
  ): Promise<HgInjectionDTO> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `Hg Summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.injectionDate = payload.injectionDate;
    entity.injectionHour = payload.injectionHour;
    entity.injectionMinute = payload.injectionMinute;
    entity.measuredValue = payload.measuredValue;
    entity.referenceValue = payload.referenceValue;

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
      throw new LoggingException(
        `Error deleting HG Injection record Id [${id}]`,
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
}
