import { Controller, Param, Get } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FuelFlowmeterAccuracyRecordDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyService } from './fuel-flowmeter-accuracy.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flowmeter Accuracy')
export class FuelFlowmeterAccuracyController {
  constructor(private readonly service: FuelFlowmeterAccuracyService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FuelFlowmeterAccuracyRecordDTO,
    description: 'Retrieves Fuel Flowmeter Accuracy records by Test Summary Id',
  })
  async getFuelFlowmeterAccuracies(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO[]> {
    return this.service.getFuelFlowmeterAccuracies(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowmeterAccuracyRecordDTO,
    description: 'Retrieves a Fuel Flowmeter Accuracy record by its Id',
  })
  async getFuelFlowmeterAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO> {
    return this.service.getFuelFlowmeterAccuracy(id);
  }
}
