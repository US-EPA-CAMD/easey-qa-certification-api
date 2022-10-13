import { Controller, Param, Post, Body, UseGuards, Get } from '@nestjs/common';
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
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceRecordDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Reference')
export class FlowToLoadReferenceWorkspaceController {
  constructor(private readonly service: FlowToLoadReferenceWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FlowToLoadReferenceRecordDTO,
    description:
      'Retrieves workspace Flow To Load Reference records by Test Summary Id',
  })
  async getFlowToLoadReferences(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FlowToLoadReferenceRecordDTO[]> {
    return this.service.getFlowToLoadReferences(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadReferenceRecordDTO,
    description:
      'Retrieves a workspace Flow To Load Reference record by its Id',
  })
  async getFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadReferenceRecordDTO> {
    return this.service.getFlowToLoadReference(id);
  }

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
