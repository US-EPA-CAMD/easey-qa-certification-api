import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsChecksService } from './test-extension-exemptions-checks.service';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Extension Exemption')
export class TestExtensionExemptionsWorkspaceController {
  constructor(
    private readonly service: TestExtensionExemptionsWorkspaceService,
    private readonly checksService: TestExtensionExemptionsChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TestExtensionExemptionRecordDTO,
    description:
      'Retrieves workspace QA Test Extension Exemption records by Location Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
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
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getTestExtensionExemption(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
  ): Promise<TestExtensionExemptionRecordDTO> {
    return this.service.getTestExtensionExemptionById(id);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: TestExtensionExemptionRecordDTO,
    description: 'Creates a Test Extension Exemption record in the workspace',
  })
  async createTestExtensionExemption(
    @Param('locId') locationId: string,
    @Body() payload: TestExtensionExemptionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestExtensionExemptionRecordDTO> {
    await this.checksService.runChecks(locationId, payload, null, false, false);
    return this.service.createTestExtensionExemption(
      locationId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: TestExtensionExemptionRecordDTO,
    description: 'Updates a Test Extension Exemption record in the workspace',
  })
  async updateTestExtensionExemption(
    @Param('locId') locationId: string,
    @Param('id') id: string,
    @Body() payload: TestExtensionExemptionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestExtensionExemptionRecordDTO> {
    await this.checksService.runChecks(locationId, payload, null, false, true);
    return this.service.updateTestExtensionExemption(
      locationId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description: 'Deletes a Test Extension Exemption from the workspace',
  })
  async deleteTestExtensionExemption(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.service.deleteTestExtensionExemption(id);
  }
}
