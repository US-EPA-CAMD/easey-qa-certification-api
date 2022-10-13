import { Controller, Param, Get } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FlowToLoadReferenceRecordDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceService } from './flow-to-load-reference.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Reference')
export class FlowToLoadReferenceController {
  constructor(private readonly service: FlowToLoadReferenceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FlowToLoadReferenceRecordDTO,
    description: 'Retrieves Flow To Load Reference records by Test Summary Id',
  })
  async getFlowToLoadReferences(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FlowToLoadReferenceRecordDTO[]> {
    return this.service.getFlowToLoadReferences(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadReferenceRecordDTO,
    description: 'Retrieves a Flow To Load Reference record by its Id',
  })
  async getFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadReferenceRecordDTO> {
    return this.service.getFlowToLoadReference(id);
  }
}
