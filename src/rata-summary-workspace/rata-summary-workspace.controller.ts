import { Body, Controller, Param, Post, Put } from '@nestjs/common';
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

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: RataSummaryRecordDTO,
    description: 'Creates a Rata summary record in the workspace',
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
