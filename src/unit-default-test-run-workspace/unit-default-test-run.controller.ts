import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
    return this.service.createUnitDefaultTestRun(_testSumId, unitDefaultTestSumId, payload, user.userId);
  }

}
