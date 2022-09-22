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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Air Emission Testing')
export class AirEmissionTestingWorkspaceController {
  constructor(private readonly service: AirEmissionTestingWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AirEmissionTestingRecordDTO,
    description:
      'Retrieves official Air Emission Testing records by Rata Summary Id',
  })
  async getAirEmissionTestings(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<AirEmissionTestingDTO[]> {
    return this.service.getAirEmissionTestings(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AirEmissionTestingRecordDTO,
    description: 'Retrieves official Air Emission Testing record by its Id',
  })
  async getAirEmissionsTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<AirEmissionTestingDTO> {
    return this.service.getAirEmissionTesting(id);
  }

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
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
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

  @Delete(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Deletes a workspace Air Emission Testing record',
  })
  async deleteAirEmissionTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    //    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.service.deleteAirEmissionTesting(testSumId, id, userId);
  }
}
