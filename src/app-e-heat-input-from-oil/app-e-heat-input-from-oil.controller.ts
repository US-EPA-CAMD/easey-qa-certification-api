import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppEHeatInputFromOilRecordDTO } from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOilService } from './app-e-heat-input-from-oil.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@ApiTags('Appendix E Heat Input From Oil')
@ApiSecurity('APIKey')
@Controller()
export class AppEHeatInputFromOilController {
  constructor(private readonly service: AppEHeatInputFromOilService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Retrieves official Appendix E Heat Input from Oil records by Appendix E Correlation Test Run Id',
  })
  async getAppEHeatInputFromOilRecords(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
  ): Promise<ArrayResponse<AppEHeatInputFromOilRecordDTO>> {
    const heatInputFromOilRecords = await this.service.getAppEHeatInputFromOilRecords(appECorrTestRunId);
    return { items: heatInputFromOilRecords };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Retrieves official Appendix E Heat Input from Oil record by its Id',
  })
  getAppEHeatInputFromOilRecord(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppEHeatInputFromOilRecord(id);
  }
}
