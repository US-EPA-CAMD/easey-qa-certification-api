import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AppECorrelationTestRunBaseDTO, AppECorrelationTestRunRecordDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { TestExtensionExemptionRecordDTO } from '../dto/test-extension-exemption.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Run')
@ApiExtraModels(AppECorrelationTestRunBaseDTO)
export class AppECorrelationTestRunController {
  constructor(private readonly service: AppECorrelationTestRunService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves an official Appendix E Correlation Test Run records by Appendix E Correlation Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(AppECorrelationTestRunBaseDTO) },
              },
            },
          },
        },
      }
  })
  async getAppECorrelationTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
  ) : Promise<ArrayResponse<AppECorrelationTestRunBaseDTO>> {
    const appECorrelationTestRunBaseDTOS = await this.service.getAppECorrelationTestRuns(appECorrTestSumId);

    return { items: appECorrelationTestRunBaseDTOS };
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
