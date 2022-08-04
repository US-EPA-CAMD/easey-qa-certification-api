import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from './../test-summary-workspace/test-summary.service';

import { ProtocolGasBaseDTO, ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGas } from '../entities/workspace/protocol-gas.entity';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';

@Injectable()
export class ProtocolGasWorkspaceService {
  constructor(
    @InjectRepository(ProtocolGasWorkspaceRepository)
    private readonly repository: ProtocolGasWorkspaceRepository,
    private readonly map: ProtocolGasMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getProtocolGas(id: string): Promise<ProtocolGas> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        'Protocol Gas not found.',
        HttpStatus.NOT_FOUND,
        { id },
      );
    }

    return entity;
  }

  async getProtocolGases(testSumId: string): Promise<ProtocolGasDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async updateProtocolgas(
    testSumId: string,
    id: string,
    payload: ProtocolGasBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<ProtocolGasDTO> {
    const timestamp = currentDateTime();

    const entity = await this.getProtocolGas(id);

    entity.gasLevelCode = payload.gasLevelCode;
    entity.gasTypeCode = payload.gasTypeCode;
    entity.vendorId = payload.vendorId;
    entity.cylinderId = payload.cylinderId;
    entity.expirationDate = payload.expirationDate;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return await this.map.one(entity);
  }
}
