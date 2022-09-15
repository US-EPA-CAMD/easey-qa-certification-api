import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Air Emission Testing')
export class AirEmissionTestingWorkspaceController {
  constructor(private readonly service: AirEmissionTestingWorkspaceService) {}

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: AirEmissionTestingRecordDTO,
    description: 'Creates a workspace Air Emission Testing record.',
  })
  createAirEmissionTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: AirEmissionTestingBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<AirEmissionTestingRecordDTO> {
    return this.service.createAirEmissionTesting(testSumId, payload, userId);
  }

  @Put(':id')
  @ApiOkResponse({
    type: AirEmissionTestingRecordDTO,
    description: 'Updates a workspace Air Emission Testing record',
  })
  updateAirEmissionTesting(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: AirEmissionTestingBaseDTO,
    //    @CurrentUser() userId: string,
  ) {
    return this.service.updateAirEmissionTesting(
      testSumId,
      id,
      payload,
      userId,
    );
  }
}
