import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { CycleTimeSummaryService } from './cycle-time-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Cycle Time Summary')
export class CycleTimeSummaryController {
  constructor(private readonly service: CycleTimeSummaryService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CycleTimeSummaryDTO,
    description:
      'Retrieves official Cycle Time Summary records by Test Summary Id',
  })
  async getCycleTimeSummarys(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<CycleTimeSummaryDTO[]> {
    return this.service.getCycleTimeSummarys(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: CycleTimeSummaryDTO,
    description: 'Retrieves official Cycle Time Summary record by its Id',
  })
  async getCycleTimeSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<CycleTimeSummaryDTO> {
    return this.service.getCycleTimeSummary(id, testSumId);
  }
}
