import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Extension Exemption')
export class TestExtensionExemptionsWorkspaceController {
  constructor(
    private readonly service: TestExtensionExemptionsWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TestExtensionExemptionRecordDTO,
    description:
      'Retrieves workspace Test Extension Exemption records per filter criteria',
  })
  async getTestExtensionExemptions(
    @Param('locId') locationId: string,
  ): Promise<TestExtensionExemptionRecordDTO[]> {
    return this.service.getTestExtensionExemptionsByLocationId(locationId);
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

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: TestExtensionExemptionRecordDTO,
    description: 'Creates a Test ExtensionExemption record in the workspace',
  })
  async createTestExtensionExemption(
    @Param('locId') locationId: string,
    @Body() payload: TestExtensionExemptionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestExtensionExemptionRecordDTO> {
    return this.service.createTestExtensionExemption(
      locationId,
      payload,
      user.userId,
    );
  }
}
