import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProtocolGasRecordDTO } from '../dto/protocol-gas.dto';
import { ProtocolGasService } from './protocol-gas.service';

@ApiTags('Protocol Gas')
@ApiSecurity('APIKey')
@Controller()
export class ProtocolGasController {
  constructor(private readonly service: ProtocolGasService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ProtocolGasRecordDTO,
    description: 'Retrieves official Protocol Gas records by Test Summary Id',
  })
  getProtocolGases(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) {
    return this.service.getProtocolGases(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: ProtocolGasRecordDTO,
    description: 'Retrieves official Protocol Gas record by its Id',
  })
  getProtocolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getProtocolGas(id);
  }
}
