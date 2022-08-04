import { v4 as uuid } from 'uuid';

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { currentDateTime } from 'src/utilities/functions';
import {
  ProtocolGasBaseDTO,
  ProtocolGasDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { TestSummaryWorkspaceService } from 'src/test-summary-workspace/test-summary.service';

@Injectable()
export class ProtocolGasWorkspaceService {
  constructor(
    @InjectRepository(ProtocolGasWorkspaceRepository)
    private readonly repository: ProtocolGasWorkspaceRepository,
    private readonly map: ProtocolGasMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getProtocolGases(testSumId: string): Promise<ProtocolGasDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async createProtocolGas(
    testSumId: string,
    payload: ProtocolGasBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<ProtocolGasRecordDTO> {
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
