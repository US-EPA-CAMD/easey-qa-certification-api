import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TestExtensionExemptionRecordDTO } from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsService } from './test-extension-exemptions.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Extension Exemption')
export class TestExtensionExemptionsController {
  constructor(private readonly service: TestExtensionExemptionsService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TestExtensionExemptionRecordDTO,
    description:
      'Retrieves workspace Test Extension Exemption records per filter criteria',
  })
  async getTestExtensionExemptions(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<TestExtensionExemptionRecordDTO>> {
    const exemptionRecordDTOS = await this.service.getTestExtensionExemptionsByLocationId(locationId);
    return {
      items: exemptionRecordDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    type: TestExtensionExemptionRecordDTO,
    description:
      'Retrieves workspace Test Extension Exemption record by its id',
  })
  async getTestExtensionExemption(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    return this.service.getTestExtensionExemptionById(id);
  }
}
