import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RataSummaryDTO, RataSummaryRecordDTO } from '../dto/rata-summary.dto';
import { RataSummaryService } from './rata-summary.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

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
  async etRataSummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') rataId: string,
  ) : Promise<ArrayResponse<RataSummaryDTO>>  {
    const rataSummaryDTOS = await this.service.getRataSummaries(rataId);

    return { items: rataSummaryDTOS };
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
