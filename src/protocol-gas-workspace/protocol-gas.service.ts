import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime, withTransaction } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  ProtocolGasBaseDTO,
  ProtocolGasDTO,
  ProtocolGasImportDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasRepository } from '../protocol-gas/protocol-gas.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';

@Injectable()
export class ProtocolGasWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: ProtocolGasWorkspaceRepository,
    private readonly map: ProtocolGasMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly historicalRepo: ProtocolGasRepository,
  ) {}

  async getProtocolGas(id: string, trx?: EntityManager): Promise<ProtocolGasDTO> {
    const repository = withTransaction(this.repository, trx);
    const entity = await repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(`A protocol gas record not found with Record Id [${id}].`),
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
    trx?: EntityManager,
  ): Promise<ProtocolGasRecordDTO> {
    const timestamp = currentDateTime().toISOString();

    const repository = withTransaction(this.repository, trx);

    let entity = repository.create({
      ...payload,
      id: uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repository.save(entity);
    entity = await repository.findOneBy({ id: entity.id });
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
    return this.map.one(entity);
  }

  async updateProtocolGas(
    testSumId: string,
    id: string,
    payload: ProtocolGasBaseDTO,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<ProtocolGasDTO> {
    const timestamp = currentDateTime();

    const repository = withTransaction(this.repository, trx);
    const entity = await repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(`A protocol gas record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.gasLevelCode = payload.gasLevelCode;
    entity.gasTypeCode = payload.gasTypeCode;
    entity.vendorIdentifier = payload.vendorIdentifier;
    entity.cylinderIdentifier = payload.cylinderIdentifier;
    entity.expirationDate = payload.expirationDate;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );

    return this.getProtocolGas(id, trx);
  }

  async deleteProtocolGas(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<void> {
    const repository = withTransaction(this.repository, trx);
    await repository.delete(id);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
  }

  async getProtocolGasByTestSumIds(
    testSumIds: string[],
  ): Promise<ProtocolGasDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<ProtocolGasDTO[]> {
    return this.getProtocolGasByTestSumIds(testSumIds);
  }

  async import(
    testSumId: string,
    payload: ProtocolGasImportDTO,
    userId: string,
    trx?: EntityManager,
  ) {
    const isImport = true;

    const createdProtocolGas = await this.createProtocolGas(
      testSumId,
      payload,
      userId,
      isImport,
      trx,
    );

    this.logger.log(
      `Protocol Gas Successfully Imported.  Record Id: ${createdProtocolGas.id}`,
    );
  }
}
