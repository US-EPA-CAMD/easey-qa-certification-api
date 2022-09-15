import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  AirEmissionTestBaseDTO,
  AirEmissionTestRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestWorkspaceService } from './air-emission-test-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Air Emission Testing')
export class AirEmissionTestWorkspaceController {
  constructor(private readonly service: AirEmissionTestWorkspaceService) {}

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: AirEmissionTestRecordDTO,
    description: 'Creates a workspace Test Qualification record.',
  })
  async createAirEmissionTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: AirEmissionTestBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<AirEmissionTestRecordDTO> {
    return this.service.createAirEmissionTest(testSumId, payload, userId);
  }
}
