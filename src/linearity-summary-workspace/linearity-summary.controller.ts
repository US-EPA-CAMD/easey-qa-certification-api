import {
  Get,
  Put,
  Post,
  Body,
  Delete,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  LinearitySummaryBaseDTO,
  LinearitySummaryRecordDTO,
} from '../dto/linearity-summary.dto';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Summary')
@ApiExcludeControllerByEnv()
export class LinearitySummaryWorkspaceController {
  constructor(
    private readonly service: LinearitySummaryWorkspaceService,
    private readonly checksService: LinearitySummaryChecksService,
  ) { }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearitySummaryRecordDTO,
    description:
      'Retrieves workspace Linearity Summary records by Test Summary Id',
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
    label: 'Retrieved linearity records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getSummariesByTestSumId(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<LinearitySummaryRecordDTO[]> {
    return this.service.getSummariesByTestSumId(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Retrieves workspace Linearity Summary record by its Id',
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
    label: 'Retrieved linearity record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getSummaryById(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<LinearitySummaryRecordDTO> {
    return this.service.getSummaryById(id);
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
    type: LinearitySummaryRecordDTO,
    description: 'Creates a Linearity Summary record in the workspace',
  })
  @AuditLog({
    label: 'Created linearity record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: LinearitySummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LinearitySummaryRecordDTO> {
    await this.checksService.runChecks(payload, testSumId);
    return this.service.createSummary(testSumId, payload, user.userId);
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
    type: LinearitySummaryRecordDTO,
    description: 'Updates a Linearity Summary record in the workspace',
  })
  @AuditLog({
    label: 'Updated linearity record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  async updateSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: LinearitySummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LinearitySummaryRecordDTO> {
    await this.checksService.runChecks(payload, testSumId, false, true);
    return this.service.updateSummary(testSumId, id, payload, user.userId);
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
    description: 'Deletes a Linearity Summary record from the workspace',
  })
  @AuditLog({
    label: 'Deleted linearity record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteSummary(testSumId, id, user.userId);
  }
}
