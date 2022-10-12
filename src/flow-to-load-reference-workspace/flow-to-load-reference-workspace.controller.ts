import { Controller, Param, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceRecordDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Reference')
export class FlowToLoadReferenceWorkspaceController {
  constructor(private readonly service: FlowToLoadReferenceWorkspaceService) {}

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FlowToLoadReferenceRecordDTO,
    description: 'Creates a workspace Flow To Load Reference record.',
  })
  async createFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FlowToLoadReferenceBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadReferenceRecordDTO> {
    return this.service.createFlowToLoadReference(
      testSumId,
      payload,
      user.userId,
    );
  }
}
