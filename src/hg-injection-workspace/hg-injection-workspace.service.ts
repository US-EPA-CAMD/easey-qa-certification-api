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

  async getHgInjections(hgTestSumId: string): Promise<HgInjectionDTO[]> {
    const records = await this.repository.find({ where: { hgTestSumId } });

    return this.map.many(records);
  }

  async getHgInjection(
    id: string,
    hgTestSumId: string,
  ): Promise<HgInjectionDTO> {
    const result = await this.repository.findOne({
      id,
      hgTestSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Hg Injeciton record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createHgInjection(
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
      hgTestSumId,
      userId,
      isImport,
    );
    return this.map.one(entity);
  }

  async updateHgInjection(
    hgTestSumId: string,
    id: string,
    payload: HgInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<HgInjectionDTO> {
    const entity = await this.repository.findOne({
      id,
      hgTestSumId,
    });

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
      hgTestSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }
}
