import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { TestExtensionExemptionRecordDTO } from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { TestExtensionExemptionsRepository } from './test-extension-exemptions.repository';

@Injectable()
export class TestExtensionExemptionsService {
  constructor(
    private readonly map: TestExtensionExemptionMap,
    @InjectRepository(TestExtensionExemptionsRepository)
    private readonly repository: TestExtensionExemptionsRepository,
  ) {}

  async getTestExtensionExemptionById(
    testSumId: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    const result = await this.repository.getTestExtensionExemptionById(
      testSumId,
    );

    if (!result) {
      throw new LoggingException(
        `A test extension exceptions record not found with Record Id [${testSumId}].`,
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
}
