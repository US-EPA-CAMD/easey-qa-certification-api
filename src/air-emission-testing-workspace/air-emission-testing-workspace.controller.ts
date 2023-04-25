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
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingChecksService } from './air-emission-testing-checks.service';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Air Emission Testing')
export class AirEmissionTestingWorkspaceController {
  constructor(
    private readonly service: AirEmissionTestingWorkspaceService,
    private readonly checksService: AirEmissionTestingChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AirEmissionTestingRecordDTO,
    description:
      'Retrieves official Air Emission Testing records by Rata Summary Id',
  })
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
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
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
  async getAirEmissionsTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<AirEmissionTestingDTO> {
    return this.service.getAirEmissionTesting(id);
  }

  @Post()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiCreatedResponse({
    type: AirEmissionTestingRecordDTO,
    description: 'Creates a workspace Air Emission Testing record.',
  })
  async createAirEmissionTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: AirEmissionTestingBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AirEmissionTestingRecordDTO> {
    await this.checksService.runChecks(payload, testSumId, false, true);
    return this.service.createAirEmissionTesting(
      testSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: AirEmissionTestingRecordDTO,
    description: 'Updates a workspace Air Emission Testing record',
  })
  async updateAirEmissionTesting(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: AirEmissionTestingBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(payload, testSumId, false, true);
    return this.service.updateAirEmissionTesting(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
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
