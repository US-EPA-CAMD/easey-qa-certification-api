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
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestRecordDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Test')
@ApiExcludeControllerByEnv()
@ApiExtraModels(FuelFlowToLoadTestRecordDTO)
export class FuelFlowToLoadTestWorkspaceController {
  constructor(private readonly service: FuelFlowToLoadTestWorkspaceService) { }

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace Fuel Flow To Load Test records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(FuelFlowToLoadTestRecordDTO) },
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
    label: 'Retrieved fuel flow to load test records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getFuelFlowToLoadTests(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FuelFlowToLoadTestRecordDTO>> {
    const fuelFlowToLoadTests = await this.service.getFuelFlowToLoadTests(testSumId);
    return { items: fuelFlowToLoadTests };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowToLoadTestRecordDTO,
    description: 'Retrieves workspace Fuel Flow To Load Test record by its Id',
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
    label: 'Retrieved fuel flow to load test record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
    return this.service.getFuelFlowToLoadTest(id, testSumId);
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
    type: FuelFlowToLoadTestRecordDTO,
    description: 'Creates a workspace Fuel Flow To Load Test record.',
  })
  @AuditLog({
    label: 'Created fuel flow to load test record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FuelFlowToLoadTestBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
    return this.service.createFuelFlowToLoadTest(
      testSumId,
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
    type: FuelFlowToLoadTestRecordDTO,
    description: 'Updates a Fuel Flow To Load Test record from the workspace',
  })
  @AuditLog({
    label: 'Updated fuel flow to load test record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  editFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FuelFlowToLoadTestBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
    return this.service.editFuelFlowToLoadTest(
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
    description: 'Deletes a Fuel Flow To Load Test record from the workspace',
  })
  @AuditLog({
    label: 'Deleted fuel flow to load test record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  deleteFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFuelFlowToLoadTest(testSumId, id, user.userId);
  }
}
