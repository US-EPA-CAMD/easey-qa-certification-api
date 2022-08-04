import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import {
  ProtocolGasBaseDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

@ApiTags('Protocol Gas')
@ApiSecurity('APIKey')
@Controller()
export class ProtocolGasWorkspaceController {
  constructor(private readonly service: ProtocolGasWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ProtocolGasRecordDTO,
    description: 'Retrieves workspace Protocol Gas records by Test Summary Id',
  })
  getProtocolGases(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) {
    return this.service.getProtocolGases(testSumId);
  }

  @Put(':id')
  @ApiOkResponse({
    type: ProtocolGasRecordDTO,
    description: 'Updates a Linearity Injection record in the workspace',
  })
  editProtolGas(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: ProtocolGasBaseDTO,
  ) {
    const userId = 'testUser';
    return this.service.updateProtocolgas(testSumId, id, payload, userId);
  }
}
