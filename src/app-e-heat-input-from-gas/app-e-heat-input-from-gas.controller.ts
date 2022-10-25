import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppEHeatInputFromGasRecordDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input From Gas')
export class AppEHeatInputFromGasController {
  constructor(private readonly service: AppEHeatInputFromGasService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputFromGasRecordDTO,
    description:
      'Retrieves a workspace Appendix E Heat Input From Gas records by Appendix E Correlation Test Run Id',
  })
  async getAppEHeatInputFromGases(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
  ) {
    return this.service.getAppEHeatInputFromGases(appECorrTestRunId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppEHeatInputFromGasRecordDTO,
    description: `Retrieves a workspace Appendix E Heat Input From Gas record by it's Id`,
  })
  async getAppEHeatInputFromGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppEHeatInputFromGas(id);
  }
}
