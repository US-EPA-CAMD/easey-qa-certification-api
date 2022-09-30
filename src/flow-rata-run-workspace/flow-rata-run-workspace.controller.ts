import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
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
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FlowRataRunBaseDTO,
  FlowRataRunDTO,
  FlowRataRunRecordDTO,
} from '../dto/flow-rata-run.dto';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow Rata Run')
export class FlowRataRunWorkspaceController {
  constructor(private readonly service: FlowRataRunWorkspaceService) {}
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FlowRataRunDTO,
    description:
      'Retrieves official Flow Rata Run records by Flow Rata Summary Id',
  })
  async getFlowRataRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') rataRunId: string,
  ): Promise<FlowRataRunDTO[]> {
    return this.service.getFlowRataRuns(rataRunId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowRataRunDTO,
    description: 'Retrieves official Flow Rata Run record by its Id',
  })
  async getFlowRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('id') flowRataRunId: string,
  ): Promise<FlowRataRunDTO> {
    return this.service.getFlowRataRun(flowRataRunId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    isArray: false,
    type: FlowRataRunRecordDTO,
    description: 'Creates a Flow Rata Run record in the workspace',
  })
  async createFlowRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') rataRunId: string,
    @Body() payload: FlowRataRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowRataRunRecordDTO> {
    return this.service.createFlowRataRun(
      testSumId,
      rataRunId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: FlowRataRunRecordDTO,
    description: 'Updates a Flow Rata Run record in the workspace',
  })
  async updateRataRun(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('id') flowRataRunId: string,
    @Body() payload: FlowRataRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowRataRunRecordDTO> {
    return this.service.updateRataRun(
      testSumId,
      flowRataRunId,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Flow Rata Run record from the workspace',
  })
  async deleteFlowRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('id') flowRataRunId: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFlowRataRun(
      testSumId,
      flowRataRunId,
      user.userId,
    );
  }
}
