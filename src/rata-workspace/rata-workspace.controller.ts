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
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataChecksService } from './rata-checks.service';
import { RataWorkspaceService } from './rata-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata')
export class RataWorkspaceController {
  constructor(
    private readonly service: RataWorkspaceService,
    private readonly checksService: RataChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataRecordDTO,
    description: 'Retrieves workspace RATA records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getRatas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<RataRecordDTO[]> {
    return this.service.getRatasByTestSumId(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: RataRecordDTO,
    description: 'Retrieves workspace RATA record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<RataRecordDTO> {
    return this.service.getRataById(id);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: RataRecordDTO,
    description: 'Creates a Rata record in the workspace',
  })
  async createRata(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: RataBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(locationId, payload, testSumId);
    return this.service.createRata(testSumId, payload, user.userId);
  }

  @Put(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: RataRecordDTO,
    description: 'Updates a Rata record in the workspace',
  })
  async updateRata(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: RataBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      testSumId,
      false,
      true,
    );
    return this.service.updateRata(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description: 'Deletes a RATA record from the workspace',
  })
  async deleteRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteRata(testSumId, id, user.userId);
  }
}
