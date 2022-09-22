import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RataTraverseRecordDTO } from '../dto/rata-traverse.dto';
import { RataTraverseService } from './rata-traverse.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Traverse')
export class RataTraverseController {
  constructor(private readonly service: RataTraverseService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataTraverseRecordDTO,
    description: 'Retrieves official Rata Traverse records by Flow Rata Run ID',
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
    description: 'Retrieves official Rata Traverse record by its Id',
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
}
