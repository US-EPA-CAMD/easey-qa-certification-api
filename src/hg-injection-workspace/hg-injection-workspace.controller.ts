import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HgInjectionBaseDTO, HgInjectionDTO } from 'src/dto/hg-injection.dto';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Injection')
export class HgInjectionWorkspaceController {
  constructor(private readonly service: HgInjectionWorkspaceService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: HgInjectionDTO,
    description: 'Creates a workspace Hg Summary record.',
  })
  createHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: HgInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgInjectionDTO> {
    return this.service.createHgInjection(testSumId, payload, user.userId);
  }
}
