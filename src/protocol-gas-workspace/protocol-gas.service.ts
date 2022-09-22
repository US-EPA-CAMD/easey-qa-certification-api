import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '../utilities/functions';
import {
  ProtocolGasBaseDTO,
  ProtocolGasDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { In } from 'typeorm';

@Injectable()
export class ProtocolGasWorkspaceService {
  constructor(
    @InjectRepository(ProtocolGasWorkspaceRepository)
    private readonly repository: ProtocolGasWorkspaceRepository,
    private readonly map: ProtocolGasMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getProtocolGas(id: string): Promise<ProtocolGasDTO> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `A protocol gas record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(entity);
  }

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
    const timestamp = currentDateTime().toLocaleDateString();

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

  async updateProtocolGas(
    testSumId: string,
    id: string,
    payload: ProtocolGasBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<ProtocolGasDTO> {
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.getProtocolGas(id);

    entity.gasLevelCode = payload.gasLevelCode;
    entity.gasTypeCode = payload.gasTypeCode;
    entity.vendorID = payload.vendorID;
    entity.cylinderID = payload.cylinderID;
    entity.expirationDate = payload.expirationDate;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getProtocolGas(id);
  }

  async deleteProtocolGas(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    await this.repository.delete(id);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }
  
  async getProtocolGasByTestSumIds(testSumIds: string[]): Promise<ProtocolGasDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<ProtocolGasDTO[]> {
    return this.getProtocolGasByTestSumIds(testSumIds);
  }
}
