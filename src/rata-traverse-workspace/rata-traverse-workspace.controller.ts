import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  RataTraverseBaseDTO,
  RataTraverseRecordDTO,
} from '../dto/rata-traverse.dto';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Traverse')
export class RataTraverseWorkspaceController {
  constructor(private readonly service: RataTraverseWorkspaceService) {}

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
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
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
    //    @CurrentUser() userId: string,
  ): Promise<RataTraverseRecordDTO> {
    const userId = 'testUser';
    return this.service.createRataTraverse(
      testSumId,
      flowRataRunId,
      payload,
      userId,
    );
  }

  @Put(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
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
    //    @CurrentUser() userId: string,
  ): Promise<RataTraverseRecordDTO> {
    const userId = 'testUser';
    return this.service.updateRataTraverse(testSumId, id, payload, userId);
  }

  @Delete(':id')
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
  ): Promise<void> {
    const userId = 'testUser';
    return this.service.deleteRataTraverse(testSumId, id, userId);
  }
}
