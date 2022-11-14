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
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  RataTraverseBaseDTO,
  RataTraverseRecordDTO,
} from '../dto/rata-traverse.dto';
import { RataTraverseChecksService } from './rata-traverse-checks.service';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Traverse')
export class RataTraverseWorkspaceController {
  constructor(
    private readonly service: RataTraverseWorkspaceService, 
    private readonly checksService: RataTraverseChecksService,
    ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataTraverseRecordDTO,
    description:
      'Retrieves a workspace Rata Traverse records by Flow Rata Run ID',
  })
  async getRataTraverses(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('flowRataRunId') flowRataRunId: string,
  ): Promise<RataTraverseRecordDTO[]> {
    return this.service.getRataTraverses(flowRataRunId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataTraverseRecordDTO,
    description: 'Retrieves a workspace Rata Traverse record by its Id',
  })
  async getRataTraverse(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('flowRataRunId') _flowRataRunId: string,
    @Param('id') id: string,
  ): Promise<RataTraverseRecordDTO> {
    return this.service.getRataTraverse(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: RataTraverseRecordDTO,
    description: 'Creates a workspace RATA Traverse record.',
  })
  async createRataTraverse(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('flowRataRunId') flowRataRunId: string,
    @Body() payload: RataTraverseBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataTraverseRecordDTO> {
    await this.checksService.runChecks(
      payload,
      _locationId,
      testSumId,
      null,
      _rataSumId,
      null,
      flowRataRunId,
      false,
      false,
    );
    return this.service.createRataTraverse(
      testSumId,
      flowRataRunId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: RataTraverseRecordDTO,
    description: 'Updates a RATA Traverse record in the workspace',
  })
  async updateRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('flowRataRunId') _flowRataRunId: string,
    @Param('id') id: string,
    @Body() payload: RataTraverseBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataTraverseRecordDTO> {
    await this.checksService.runChecks(
      payload,
      _locationId,
      testSumId,
      null,
      _rataSumId,
      null,
      _flowRataRunId,
      false,
      true,
    );
    return this.service.updateRataTraverse(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a RATA Traverse record from the workspace',
  })
  deleteRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('flowRataRunId') _flowRataRunId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteRataTraverse(testSumId, id, user.userId);
  }
}
