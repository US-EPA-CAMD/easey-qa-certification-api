import {
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
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
import { FlowToLoadCheckWorkspaceService } from './flow-to-load-check-workspace.service';
import {
  FlowToLoadCheckBaseDTO,
  FlowToLoadCheckDTO,
  FlowToLoadCheckRecordDTO,
} from '../dto/flow-to-load-check.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Check')
export class FlowToLoadCheckWorkspaceController {
  constructor(private readonly service: FlowToLoadCheckWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FlowToLoadCheckRecordDTO,
    description:
      'Retrieves workspace Flow To Load Check records by Test Summary Id',
  })
  async getFlowToLoadChecks(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FlowToLoadCheckRecordDTO[]> {
    return this.service.getFlowToLoadChecks(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadCheckRecordDTO,
    description: 'Retrieves a workspace Flow To Load Check record by its Id',
  })
  async getFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadCheckRecordDTO> {
    return this.service.getFlowToLoadCheck(id);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FlowToLoadCheckRecordDTO,
    description: 'Creates a workspace Flow To Load Check record.',
  })
  async createFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FlowToLoadCheckBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadCheckRecordDTO> {
    return this.service.createFlowToLoadCheck(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: FlowToLoadCheckDTO,
    description: 'Updates a workspace Flow To Load Check record',
  })
  editFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FlowToLoadCheckBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadCheckDTO> {
    return this.service.editFlowToLoadCheck(
      testSumId,
      id,
      payload,
      user.userId,
      false,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Flow To Load Check record from the workspace',
  })
  async deleteFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFlowToLoadCheck(testSumId, id, user.userId, false);
  }
}
