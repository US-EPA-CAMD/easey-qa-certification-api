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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowmeterAccuracyBaseDTO,
  FuelFlowmeterAccuracyDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyWorkspaceService } from './fuel-flowmeter-accuracy-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flowmeter Accuracy')
export class FuelFlowmeterAccuracyWorkspaceController {
  constructor(
    private readonly service: FuelFlowmeterAccuracyWorkspaceService,
  ) {}

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
  async getFuelFlowmeterAccuracies(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowmeterAccuracyDTO[]> {
    return this.service.getFuelFlowmeterAccuracies(testSumId);
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
  async deleteFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFuelFlowmeterAccuracy(testSumId, id, user.userId);
  }
}
