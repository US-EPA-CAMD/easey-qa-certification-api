import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { FlowRataRunService } from './flow-rata-run.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow Rata Run')
export class FlowRataRunController {
  constructor(private readonly service: FlowRataRunService) {}
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
  ): Promise<ArrayResponse<FlowRataRunDTO>> {
    const flowRataRunDTOS =  await this.service.getFlowRataRuns(rataRunId);

    return  {
      items: flowRataRunDTOS
    };
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
}
