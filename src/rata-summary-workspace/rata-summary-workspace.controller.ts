import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  RataSummaryBaseDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummaryChecksService } from './rata-summary-checks.service';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: RataSummaryRecordDTO,
    description: 'Creates a workspace Rata Summary record.',
  })
  async createRataSummary(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') rataId: string,
    @Body() payload: RataSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataSummaryRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      false,
      false,
      rataId,
      testSumId,
    );
    return this.service.createRataSummary(testSumId, rataId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
    @User() user: CurrentUser,
  ): Promise<RataSummaryRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      false,
      true,
      rataId,
      testSumId,
    );
    return this.service.updateRataSummary(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Rata summary record from the workspace',
  })
  async deleteRataSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteRataSummary(testSumId, id, user.userId);
  }
}
