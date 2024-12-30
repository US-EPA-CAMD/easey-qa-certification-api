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
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  RataSummaryBaseDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummaryChecksService } from './rata-summary-checks.service';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Summary')
export class RataSummaryWorkspaceController {
  constructor(
    private readonly service: RataSummaryWorkspaceService,
    private readonly checksService: RataSummaryChecksService,
  ) { }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataSummaryRecordDTO,
    description: 'Retrieves workspace Rata Summary records.',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved RATA summary records for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'rataId']
  })
  getRataSummaryes(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') rataId: string,
  ) {
    return this.service.getRataSummaries(rataId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataSummaryRecordDTO,
    description: 'Retrieves a workspace Rata Summary record.',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved RATA summary record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'rataId', 'id']
  })
  getRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('id') id: string,
  ) {
    return this.service.getRataSummary(id);
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
    type: RataSummaryRecordDTO,
    description: 'Creates a workspace Rata Summary record.',
  })
  @AuditLog({
    label: 'Created RATA summary record for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'rataId'],
    responseBodyOutFields: '*'
  })
  async createRataSummary(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') rataId: string,
    @Body() payload: RataSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataSummaryRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      false,
      false,
      rataId,
      testSumId,
    );
    return this.service.createRataSummary(
      testSumId,
      rataId,
      payload,
      user.userId,
    );
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
    type: RataSummaryRecordDTO,
    description: 'Updates a Rata summary record in the workspace',
  })
  @AuditLog({
    label: 'Updated RATA summary record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'rataId', 'id'],
    responseBodyOutFields: '*'
  })
  async updateRataSummary(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') rataId: string,
    @Param('id') id: string,
    @Body() payload: RataSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataSummaryRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      false,
      true,
      rataId,
      testSumId,
    );
    return this.service.updateRataSummary(testSumId, id, payload, user.userId);
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
    description: 'Deletes a Rata summary record from the workspace',
  })
  @AuditLog({
    label: 'Deleted RATA summary record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'rataId', 'id']
  })
  async deleteRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteRataSummary(testSumId, id, user.userId);
  }
}
