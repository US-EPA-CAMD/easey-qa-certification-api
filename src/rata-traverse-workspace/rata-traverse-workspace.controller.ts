import { Body, Controller, Param, Post, Put } from '@nestjs/common';
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

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: RataTraverseRecordDTO,
    description: 'Creates a RATA Traverse record in the workspace.',
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
    @Param('flowRataRunId') flowRataRunId: string,
    @Param('id') id: string,
    @Body() payload: RataTraverseBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataTraverseRecordDTO> {
    const userId = 'testUser';
    return this.service.updateRataTraverse(testSumId, id, payload, userId);
  }
}
