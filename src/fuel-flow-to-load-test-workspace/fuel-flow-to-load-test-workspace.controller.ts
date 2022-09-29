import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestRecordDTO,
} from 'src/dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Test')
export class FuelFlowToLoadTestWorkspaceController {
  constructor(private readonly service: FuelFlowToLoadTestWorkspaceService) {}

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FuelFlowToLoadTestRecordDTO,
    description: 'Creates a workspace Fuel Flow To Load Test record.',
  })
  async createFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FuelFlowToLoadTestBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
    return this.service.createFuelFlowToLoadTest(testSumId, payload, userId);
  }
}
