import { Controller, Param, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowmeterAccuracyBaseDTO,
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

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FuelFlowmeterAccuracyRecordDTO,
    description: 'Creates a workspace Fuel Flowmeter Accuracy record.',
  })
  async createFlowToLoadReference(
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
}
