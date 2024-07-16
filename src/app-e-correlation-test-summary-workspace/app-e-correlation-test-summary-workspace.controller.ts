import {
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryRecordDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AppECorrelationTestSummaryChecksService } from './app-e-correlation-test-summary-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Summary')
export class AppendixETestSummaryWorkspaceController {
  constructor(
    private readonly service: AppECorrelationTestSummaryWorkspaceService,
    private readonly checksService: AppECorrelationTestSummaryChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppECorrelationTestSummaryRecordDTO,
    description:
      'Retrieves workspace Appendix E Correlation Test Summary records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getAppECorrelations(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO[]> {
    return this.service.getAppECorrelations(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppECorrelationTestSummaryRecordDTO,
    description:
      'Retrieves a workspace Appendix E Correlation Test Summary record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    return this.service.getAppECorrelation(id);
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
    type: AppECorrelationTestSummaryRecordDTO,
    description:
      'Creates a workspace Appendix E Correlation Test Summary record.',
  })
  async createAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: AppECorrelationTestSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    await this.checksService.runChecks(payload, null, testSumId);
    return this.service.createAppECorrelation(testSumId, payload, user.userId);
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
    type: AppECorrelationTestSummaryRecordDTO,
    description: 'Updates a workspace Appendix E Test Summary record',
  })
  async editAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: AppECorrelationTestSummaryBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(payload, id, testSumId, false);
    return this.service.editAppECorrelation(
      testSumId,
      id,
      payload,
      user.userId,
    );
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
    description:
      'Deletes a workspace Appendix E Correlation Test Summary record',
  })
  async deleteAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteAppECorrelation(testSumId, id, user.userId);
  }
}
