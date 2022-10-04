import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppEHeatInputOilRecordDTO } from '../dto/app-e-heat-input-oil.dto';
import { AppEHeatInputOilService } from './app-e-heat-input-oil.service';

@ApiTags('Appendix E Heat Input Oil')
@ApiSecurity('APIKey')
@Controller()
export class AppEHeatInputOilController {
  constructor(private readonly service: AppEHeatInputOilService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputOilRecordDTO,
    description: 'Retrieves official Appendix E Heat Input Oil records by Appendix E Correlation Test Run Id',
  })
  getAppEHeatInputOilRecords(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
  ): Promise<AppEHeatInputOilRecordDTO[]> {
    return this.service.getAppEHeatInputOilRecords(appECorrTestRunId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppEHeatInputOilRecordDTO,
    description: 'Retrieves official Appendix E Heat Input Oil record by its Id',
  })
  getAppEHeatInputOilRecord(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppEHeatInputOilRecord(id);
  }
}
