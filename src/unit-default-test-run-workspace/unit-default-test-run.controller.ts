import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test Run')
export class UnitDefaultTestRunWorkspaceController {
  constructor(private readonly service: UnitDefaultTestRunWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitDefaultTestRunDTO,
    description:
      'Retrieves official Unit Default Test Run records by Unit Default Test Summary Id',
  })
  async getUnitDefaultTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunDTO[]> {
    return this.service.getUnitDefaultTestRuns(unitDefaultTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: UnitDefaultTestRunDTO,
    description: 'Retrieves official Unit Default Test Run record by its Id',
  })
  async getUnitDefaultTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
    @Param('id') id: string,
  ): Promise<UnitDefaultTestRunDTO> {
    return this.service.getUnitDefaultTestRun(id, unitDefaultTestSumId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: UnitDefaultTestRunDTO,
    description: 'Creates a workspace Unit Default Test Run record.',
  })
  createUnitDefaultTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
    @Body() payload: UnitDefaultTestRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDefaultTestRunDTO> {
    return this.service.createUnitDefaultTestRun(
      _testSumId,
      unitDefaultTestSumId,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Unit Default Test Run record from the workspace',
  })
  async deleteUnitDefaultTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') _unitDefaultTestSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteUnitDefaultTestRun(testSumId, id, user.userId);
  }
}
