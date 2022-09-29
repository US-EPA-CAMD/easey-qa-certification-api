import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  AirEmissionTestingBaseDTO,
  AirEmissionTestingDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: AirEmissionTestingRecordDTO,
    description: 'Creates a workspace Air Emission Testing record.',
  })
  createAirEmissionTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: AirEmissionTestingBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AirEmissionTestingRecordDTO> {
    return this.service.createAirEmissionTesting(
      testSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: AirEmissionTestingRecordDTO,
    description: 'Updates a workspace Air Emission Testing record',
  })
  updateAirEmissionTesting(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: AirEmissionTestingBaseDTO,
    @User() user: CurrentUser,
  ) {
    return this.service.updateAirEmissionTesting(
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
    description: 'Deletes a workspace Air Emission Testing record',
  })
  async deleteAirEmissionTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteAirEmissionTesting(testSumId, id, user.userId);
  }
}
