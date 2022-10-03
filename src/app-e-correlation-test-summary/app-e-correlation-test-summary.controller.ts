import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppECorrelationTestSummaryRecordDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Summary')
export class AppendixETestSummaryController {
  constructor(private readonly service: AppECorrelationTestSummaryService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppECorrelationTestSummaryRecordDTO,
    description:
      'Retrieves official Appendix E Correlation Test Summary records by Test Summary Id',
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
      'Retrieves an official Appendix E Correlation Test Summary record by its Id',
  })
  async getAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    return this.service.getAppECorrelation(testSumId);
  }
}
