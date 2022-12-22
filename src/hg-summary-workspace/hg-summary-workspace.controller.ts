import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { HgSummaryBaseDTO, HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Summary')
export class HgSummaryWorkspaceController {
  constructor(private readonly service: HgSummaryWorkspaceService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: HgSummaryDTO,
    description: 'Creates a workspace Hg Summary record.',
  })
  createHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: HgSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgSummaryDTO> {
    return this.service.createHgSummary(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: HgSummaryDTO,
    description: 'Updates a workspace Hg Summary record.',
  })
  updateHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: HgSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgSummaryDTO> {
    return this.service.updateHgSummary(testSumId, id, payload, user.userId);
  }
}
