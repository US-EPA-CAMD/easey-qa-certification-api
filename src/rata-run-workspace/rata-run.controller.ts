import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  RataRunBaseDTO,
  RataRunDTO,
  RataRunRecordDTO,
} from '../dto/rata-run.dto';
import { RataRunWorkspaceService } from './rata-run.service';

@Controller()
@ApiTags('Rata Run')
export class RataRunWorkspaceController {
  constructor(private readonly service: RataRunWorkspaceService) {}
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataRunDTO,
    description: 'Retrieves official Rata Run records by Rata Summary Id',
  })
  async getRataRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') rataSumId: string,
  ): Promise<RataRunDTO[]> {
    return this.service.getRataRuns(rataSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataRunDTO,
    description: 'Retrieves official Rata Run record by its Id',
  })
  async getRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') rataRunId: string,
  ): Promise<RataRunDTO> {
    return this.service.getRataRun(rataRunId);
  }

  @Post()
  @ApiOkResponse({
    isArray: false,
    type: RataRunRecordDTO,
    description: 'Creates a Rata Run record in the workspace',
  })
  async createRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') rataSumId: string,
    @Body() payload: RataRunBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataRunRecordDTO> {
    const userId = 'testUser';
    return this.service.createRataRun(testSumId, rataSumId, payload, userId);
  }
}
