import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
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
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineRecordDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Baseline')
export class FuelFlowToLoadBaselineWorkspaceController {
  constructor(
    private readonly service: FuelFlowToLoadBaselineWorkspaceService,
  ) {}

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FuelFlowToLoadBaselineRecordDTO,
    description: 'Creates a workspace Fuel Flow To Load Baseline record.',
  })
  async createFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FuelFlowToLoadBaselineBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowToLoadBaselineRecordDTO> {
    return this.service.createFuelFlowToLoadBaseline(
      testSumId,
      payload,
      user.userId,
    );
  }
}
