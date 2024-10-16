import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import {
  TestExtensionExemptionDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { TestExtensionExemptionsRepository } from './test-extension-exemptions.repository';

@Injectable()
export class TestExtensionExemptionsService {
  constructor(
    private readonly map: TestExtensionExemptionMap,
    private readonly repository: TestExtensionExemptionsRepository,
  ) {}

  async getTestExtensionExemptionById(
    id: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    const result = await this.repository.getTestExtensionExemptionById(id);

    if (!result) {
      throw new EaseyException(
        new Error(
          `A QA Test Extension Exemption record not found with Record Id [${id}]`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getTestExtensionExemptionsByLocationId(
    locationId: string,
  ): Promise<TestExtensionExemptionRecordDTO[]> {
    const results = await this.repository.getTestExtensionExemptionsByLocationId(
      locationId,
    );

    return this.map.many(results);
  }

  async getTestExtensions(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaTestExtensionExemptionIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestExtensionExemptionDTO[]> {
    const results = await this.repository.getTestExtensionsByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      qaTestExtensionExemptionIds,
      beginDate,
      endDate,
    );
    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaTestExtensionExemptionIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestExtensionExemptionDTO[]> {
    const results = await this.getTestExtensions(
      facilityId,
      unitIds,
      stackPipeIds,
      qaTestExtensionExemptionIds,
      beginDate,
      endDate,
    );
    return results;
  }
}
