import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
import { RataSummaryChecksService } from './rata-summary-checks.service';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Summary')
export class RataSummaryWorkspaceController {
  constructor(
    private readonly service: RataSummaryWorkspaceService,
    private readonly checksService: RataSummaryChecksService,
  ) {}

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
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') rataId: string,
    @Body() payload: RataSummaryBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataSummaryRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      false,
      false,
      rataId,
      testSumId,
    );
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
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') rataId: string,
    @Param('id') id: string,
    @Body() payload: RataSummaryBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataSummaryRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      false,
      true,
      rataId,
      testSumId,
    );
    return this.service.updateRataSummary(testSumId, id, payload, userId);
  }

  @Delete(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Deletes a Rata summary record from the workspace',
  })
  async deleteRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('id') id: string,
    //    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.service.deleteRataSummary(testSumId, id, userId);
  }
}
