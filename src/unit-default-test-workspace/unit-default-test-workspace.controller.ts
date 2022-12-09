import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test')
export class UnitDefaultTestWorkspaceController {
  constructor(private readonly service: UnitDefaultTestWorkspaceService) {}

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
}
