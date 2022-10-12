import { Controller, Param, Get } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FlowToLoadCheckService } from './flow-to-load-check.service';
import { FlowToLoadCheckRecordDTO } from '../dto/flow-to-load-check.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Check')
export class FlowToLoadCheckController {
  constructor(private readonly service: FlowToLoadCheckService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FlowToLoadCheckRecordDTO,
    description: 'Retrieves Flow To Load Check records by Test Summary Id',
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
    description: 'Retrieves a Flow To Load Check record by its Id',
  })
  async getFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadCheckRecordDTO> {
    return this.service.getFlowToLoadCheck(id);
  }
}
