import {
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryRecordDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Summary')
export class AppendixETestSummaryWorkspaceController {
  constructor(
    private readonly service: AppECorrelationTestSummaryWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppECorrelationTestSummaryRecordDTO,
    description:
      'Retrieves workspace Appendix E Correlation Test Summary records by Test Summary Id',
  })
  async getAppECorrelations(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO[]> {
    return this.service.getAppECorrelations(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppECorrelationTestSummaryRecordDTO,
    description:
      'Retrieves a workspace Appendix E Correlation Test Summary record by its Id',
  })
  async getAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    return this.service.getAppECorrelation(id);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: AppECorrelationTestSummaryRecordDTO,
    description: 'Creates a workspace Appendix E Test Summary record.',
  })
  async createAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: AppECorrelationTestSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    return this.service.createAppECorrelation(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: AppECorrelationTestSummaryRecordDTO,
    description: 'Updates a workspace Appendix E Test Summary record',
  })
  updateAppECorrelation(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: AppECorrelationTestSummaryBaseDTO,
    @User() user: CurrentUser,
  ) {
    return this.service.updateAppECorrelation(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }
}
