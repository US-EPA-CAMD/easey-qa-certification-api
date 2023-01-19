import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Test Extension Exemption from the workspace',
  })
  async deleteTestExtensionExemption(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteTestExtensionExemption(id);
  }
}
