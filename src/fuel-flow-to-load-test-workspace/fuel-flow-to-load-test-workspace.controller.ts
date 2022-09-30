import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestRecordDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Test')
export class FuelFlowToLoadTestWorkspaceController {
  constructor(private readonly service: FuelFlowToLoadTestWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FuelFlowToLoadTestRecordDTO,
    description:
      'Retrieves workspace Fuel Flow To Load Test records by Test Summary Id',
  })
  async getFuelFlowToLoadTests(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowToLoadTestRecordDTO[]> {
    return this.service.getFuelFlowToLoadTests(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowToLoadTestRecordDTO,
    description: 'Retrieves workspace Fuel Flow To Load Test record by its Id',
  })
  async getFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
    return this.service.getFuelFlowToLoadTest(testSumId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FuelFlowToLoadTestRecordDTO,
    description: 'Creates a workspace Fuel Flow To Load Test record.',
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
}
