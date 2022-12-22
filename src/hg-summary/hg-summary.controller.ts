import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummaryService } from './hg-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Summary')
export class HgSummaryController {
  constructor(private readonly service: HgSummaryService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: HgSummaryDTO,
    description: 'Retrieves workspace Hg Summary records by Test Summary Id',
  })
  async getHgSummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<HgSummaryDTO[]> {
    return this.service.getHgSummaries(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: HgSummaryDTO,
    description: 'Retrieves workspace Hg Summary record by its Id',
  })
  async getHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<HgSummaryDTO> {
    return this.service.getHgSummary(id, testSumId);
  }
}
