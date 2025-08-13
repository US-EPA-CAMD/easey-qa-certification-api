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
  ApiCreatedResponse, ApiOkResponse,
  ApiSecurity,
  ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunRecordDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';
import { AppECorrelationTestRunChecksService } from './app-e-correlation-test-run-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Run')
@ApiExcludeControllerByEnv()
@ApiExtraModels(AppECorrelationTestRunBaseDTO)
export class AppECorrelationTestRunWorkspaceController {
  constructor(
    private readonly service: AppECorrelationTestRunWorkspaceService,
    private readonly checkService: AppECorrelationTestRunChecksService,
  ) { }

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves aworkspace Appendix E Correlation Test Run records by Appendix E Correlation Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(AppECorrelationTestRunBaseDTO) },
              },
            },
          },
        },
      }
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
    label: 'Retrieved appendix E correlation test runs for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId']
  })
  async getAppECorrelationTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
  ) : Promise<ArrayResponse<AppECorrelationTestRunBaseDTO>> {
    const appECorrelationTestRunBaseDTOS = await this.service.getAppECorrelationTestRuns(appECorrTestSumId);

    return { items: appECorrelationTestRunBaseDTOS };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppECorrelationTestRunRecordDTO,
    description:
      'Retrieves aworkspace Appendix E Correlation Test Run record by its unique Id',
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
    label: 'Retrieved appendix E correlation test run by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'id']
  })
  async getAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppECorrelationTestRun(id);
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
    type: AppECorrelationTestRunRecordDTO,
    description: 'Creates a workspace Appendix E Correlation Test Run record.',
  })
  @AuditLog({
    label: 'Created appendix E correlation test run for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId'],
    responseBodyOutFields: '*'
  })
  async createAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
    @Body() payload: AppECorrelationTestRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppECorrelationTestRunRecordDTO> {
    await this.checkService.runChecks(payload, null, appECorrTestSumId, false);
    return this.service.createAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
      payload,
      user.userId,
      false,
      null,
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
    type: AppECorrelationTestRunRecordDTO,
    description: 'Updates a workspace Appendix E Correlation Test Run record.',
  })
  @AuditLog({
    label: 'Updated appendix E correlation test run by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'id'],
    responseBodyOutFields: '*'
  })
  async updateAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
    @Param('id') id: string,
    @Body() payload: AppECorrelationTestRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppECorrelationTestRunRecordDTO> {
    await this.checkService.runChecks(payload, id, appECorrTestSumId, false);
    return this.service.updateAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
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
    description: 'Deletes a workspace Appendix E Correlation Test Run record.',
  })
  @AuditLog({
    label: 'Deleted appendix E correlation test run by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'id']
  })
  async deleteAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
      id,
      user.userId,
    );
  }
}
