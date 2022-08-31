import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RataSummaryRecordDTO } from '../dto/rata-summary.dto';
import { RataSummaryService } from './rata-summary.service';

@ApiTags('Rata Summary')
@ApiSecurity('APIKey')
@Controller()
export class RataSummaryController {
  constructor(private readonly service: RataSummaryService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataSummaryRecordDTO,
    description: 'Retrieves official Rata Summary records.',
  })
  getRataSummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') rataId: string,
  ) {
    return this.service.getRataSummaries(rataId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataSummaryRecordDTO,
    description: 'Retrieves an official Rata Summary record.',
  })
  getRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('id') id: string,
  ) {
    return this.service.getRataSummary(id);
  }
}
