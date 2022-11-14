import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
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
  FuelFlowmeterAccuracyBaseDTO,
  FuelFlowmeterAccuracyDTO,
  FuelFlowmeterAccuracyRecordDTO,
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
    type: FuelFlowmeterAccuracyRecordDTO,
    description:
      'Retrieves Workspace Fuel Flowmeter Accuracy records by Test Summary Id',
  })
  async getFuelFlowmeterAccuracies(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO[]> {
    return this.service.getFuelFlowmeterAccuracies(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowmeterAccuracyRecordDTO,
    description:
      'Retrieves a Workspace Fuel Flowmeter Accuracy record by its Id',
  })
  async getFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO> {
    return this.service.getFuelFlowmeterAccuracy(id);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FuelFlowmeterAccuracyRecordDTO,
    description: 'Creates a workspace Fuel Flowmeter Accuracy record.',
  })
  async createFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FuelFlowmeterAccuracyBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowmeterAccuracyRecordDTO> {
    return this.service.createFuelFlowmeterAccuracy(
      testSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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