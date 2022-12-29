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
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestDTO,
  UnitDefaultTestRecordDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test')
export class UnitDefaultTestWorkspaceController {
  constructor(private readonly service: UnitDefaultTestWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitDefaultTestDTO,
    description:
      'Retrieves workspace Unit Default Test records by Test Summary Id',
  })
  async getUnitDefaultTests(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<UnitDefaultTestDTO[]> {
    return this.service.getUnitDefaultTests(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: UnitDefaultTestDTO,
    description: 'Retrieves workspace Unit Default Test record by its Id',
  })
  async getUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<UnitDefaultTestDTO> {
    return this.service.getUnitDefaultTest(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: UnitDefaultTestDTO,
    description: 'Creates a workspace Unit Default Test record.',
  })
  createUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: UnitDefaultTestBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDefaultTestDTO> {
    return this.service.createUnitDefaultTest(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    isArray: true,
    type: UnitDefaultTestRecordDTO,
    description: 'Updates workspace Unit Default Test record',
  })
  updateUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: UnitDefaultTestBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDefaultTestDTO> {
    return this.service.updateUnitDefaultTest(
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
    description: 'Deletes a unit default test record from the workspace',
  })
  async deleteUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteUnitDefaultTest(testSumId, id, user.userId);
  }
}
