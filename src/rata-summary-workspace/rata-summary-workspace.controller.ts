import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  RataSummaryBaseDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Summary')
export class RataSummaryWorkspaceController {
  constructor(private readonly service: RataSummaryWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataSummaryRecordDTO,
    description: 'Retrieves workspace Rata Summary records.',
  })
  getRataSummaryes(
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
    description: 'Retrieves a workspace Rata Summary record.',
  })
  getRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('id') id: string,
  ) {
    return this.service.getRataSummary(id);
  }

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: RataSummaryRecordDTO,
    description: 'Creates a workspace Rata Summary record.',
  })
  async createRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') rataId: string,
    @Body() payload: RataSummaryBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataSummaryRecordDTO> {
    return this.service.createRataSummary(testSumId, rataId, payload, userId);
  }

  @Put(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: RataSummaryRecordDTO,
    description: 'Updates a Rata summary record in the workspace',
  })
  async updateRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('id') id: string,
    @Body() payload: RataSummaryBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataSummaryRecordDTO> {
    return this.service.updateRataSummary(testSumId, id, payload, userId);
  }
}
