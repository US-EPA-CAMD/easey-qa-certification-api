import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FlowRataRunBaseDTO, FlowRataRunDTO, FlowRataRunRecordDTO } from '../dto/flow-rata-run.dto';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow Rata Run')
export class FlowRataRunWorkspaceController {
  constructor(
    private readonly service: FlowRataRunWorkspaceService,
  ) {}
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FlowRataRunDTO,
    description: 'Retrieves official Flow Rata Run records by Flow Rata Summary Id',
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
  @ApiCreatedResponse({
    isArray: false,
    type: FlowRataRunRecordDTO,
    description: 'Creates a Flow Rata Run record in the workspace',
  })
  async createRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') rataRunId: string,
    @Body() payload: FlowRataRunBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<FlowRataRunRecordDTO> {
    return this.service.createRataRun(
      testSumId, 
      rataRunId, 
      payload, 
      userId
    );
  }
}
