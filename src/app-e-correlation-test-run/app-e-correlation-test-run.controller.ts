import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppECorrelationTestRunRecordDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Run')
export class AppECorrelationTestRunController {
  constructor(private readonly service: AppECorrelationTestRunService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppECorrelationTestRunRecordDTO,
    description:
      'Retrieves an official Appendix E Correlation Test Run records by Appendix E Correlation Test Summary Id',
  })
  async getAppECorrelationTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
  ) {
    return this.service.getAppECorrelationTestRuns(appECorrTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppECorrelationTestRunRecordDTO,
    description:
      'Retrieves an official Appendix E Correlation Test Run record by its unique Id',
  })
  async getAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppECorrelationTestRun(id);
  }
}
