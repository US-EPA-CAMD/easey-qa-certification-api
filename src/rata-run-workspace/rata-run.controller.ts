import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  RataRunBaseDTO,
  RataRunDTO,
  RataRunRecordDTO,
} from '../dto/rata-run.dto';
import { RataRunWorkspaceService } from './rata-run.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Run')
export class RataRunWorkspaceController {
  constructor(private readonly service: RataRunWorkspaceService) {}
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataRunDTO,
    description: 'Get many Rata Run record in the workspace by Rata Summary Id',
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
    description: 'Get a Rata Run record in the workspace',
  })
  async getRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('id') rataRunId: string,
  ): Promise<RataRunDTO> {
    return this.service.getRataRun(rataRunId);
  }

  @Post()
  @ApiCreatedResponse({
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
    return this.service.createRataRun(testSumId, rataSumId, payload, userId);
  }

  @Put(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: RataRunRecordDTO,
    description: 'Updates a Rata Run record in the workspace',
  })
  async updateRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('id') id: string,
    @Body() payload: RataRunBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataRunRecordDTO> {
    return this.service.updateRataRun(testSumId, id, payload, userId);
  }
}
