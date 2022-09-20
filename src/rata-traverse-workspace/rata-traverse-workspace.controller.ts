import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  RataTraverseBaseDTO,
  RataTraverseRecordDTO,
} from '../dto/rata-traverse-data.dto';
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
    @Param('rataRunId') rataRunId: string,
    @Body() payload: RataTraverseBaseDTO,
    //    @CurrentUser() userId: string,
  ) {
    const userId = 'testUser';
    return this.service.createRataTraverse(
      testSumId,
      rataRunId,
      payload,
      userId,
    );
  }
}
