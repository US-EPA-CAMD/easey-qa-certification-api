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

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunRecordDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';
import { UnitDefaultTestRunChecksService } from './unit-default-test-run-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test Run')
export class UnitDefaultTestRunWorkspaceController {
  constructor(
    private readonly service: UnitDefaultTestRunWorkspaceService,
    private readonly checksService: UnitDefaultTestRunChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitDefaultTestRunRecordDTO,
    description:
      'Retrieves official Unit Default Test Run records by Unit Default Test Summary Id',
  })
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  async getUnitDefaultTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunRecordDTO[]> {
    return this.service.getUnitDefaultTestRuns(unitDefaultTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: UnitDefaultTestRunRecordDTO,
    description: 'Retrieves official Unit Default Test Run record by its Id',
  })
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  async getUnitDefaultTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
    @Param('id') id: string,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    return this.service.getUnitDefaultTestRun(id, unitDefaultTestSumId);
  }

  @Post()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiCreatedResponse({
    type: UnitDefaultTestRunRecordDTO,
    description: 'Creates a workspace Unit Default Test Run record.',
  })
  async createUnitDefaultTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
    @Body() payload: UnitDefaultTestRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    await this.checksService.runChecks(
      payload,
      false,
      false,
      unitDefaultTestSumId,
      _testSumId,
    );
    return this.service.createUnitDefaultTestRun(
      _testSumId,
      unitDefaultTestSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: UnitDefaultTestRunRecordDTO,
    description: 'Updates a workspace Unit Default Test Run record.',
  })
  async updateUnitDefaultTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') _unitDefaultTestSumId: string,
    @Param('id') id: string,
    @Body() payload: UnitDefaultTestRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    await this.checksService.runChecks(
      payload,
      false,
      true,
      _unitDefaultTestSumId,
      testSumId,
    );
    return this.service.updateUnitDefaultTestRun(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
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
