import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

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

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: ProtocolGasRecordDTO,
    description: 'Creates a Protocol Gas record in the workspace',
  })
  async createLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: ProtocolGasBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<ProtocolGasRecordDTO> {
    const userId = 'testUser';
    return this.service.createProtocolGas(testSumId, payload, userId);
  }
}
