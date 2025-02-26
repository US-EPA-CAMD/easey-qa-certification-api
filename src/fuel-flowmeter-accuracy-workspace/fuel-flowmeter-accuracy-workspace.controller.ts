import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiCreatedResponse, ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowmeterAccuracyBaseDTO,
  FuelFlowmeterAccuracyDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyWorkspaceService } from './fuel-flowmeter-accuracy-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flowmeter Accuracy')
@ApiExcludeControllerByEnv()
export class FuelFlowmeterAccuracyWorkspaceController {
  constructor(
    private readonly service: FuelFlowmeterAccuracyWorkspaceService,
  ) { }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FuelFlowmeterAccuracyDTO,
    description:
      'Retrieves Workspace Fuel Flowmeter Accuracy records by Test Summary Id',
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
    label: 'Retrieved fuel flowmeter accuracy records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getFuelFlowmeterAccuracies(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FuelFlowmeterAccuracyDTO>> {
    const fuelFlowmeterAccuracies = await this.service.getFuelFlowmeterAccuracies(testSumId);
    return { items: fuelFlowmeterAccuracies };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowmeterAccuracyDTO,
    description:
      'Retrieves a Workspace Fuel Flowmeter Accuracy record by its Id',
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
    label: 'Retrieved fuel flowmeter accuracy record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowmeterAccuracyDTO> {
    return this.service.getFuelFlowmeterAccuracy(id);
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
    type: FuelFlowmeterAccuracyDTO,
    description: 'Creates a workspace Fuel Flowmeter Accuracy record.',
  })
  @AuditLog({
    label: 'Created fuel flowmeter accuracy record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FuelFlowmeterAccuracyBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowmeterAccuracyDTO> {
    return this.service.createFuelFlowmeterAccuracy(
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
    type: FuelFlowmeterAccuracyDTO,
    description: 'Updates a workspace Fuel FLowmeter Accuracy record',
  })
  @AuditLog({
    label: 'Updated fuel flowmeter accuracy record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  editFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FuelFlowmeterAccuracyBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowmeterAccuracyDTO> {
    return this.service.editFuelFlowmeterAccuracy(
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
    description: 'Deletes a Fuel Flowmeter record from the workspace',
  })
  @AuditLog({
    label: 'Deleted fuel flowmeter accuracy record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFuelFlowmeterAccuracy(testSumId, id, user.userId);
  }
}
