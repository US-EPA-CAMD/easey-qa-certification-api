import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  ): Promise<ProtocolGasRecordDTO[]> {
    return this.service.getProtocolGases(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: ProtocolGasRecordDTO,
    description: 'Retrieves workspace Protocol Gas record by its Id',
  })
  getProtocolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getProtocolGas(id);
  }

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: ProtocolGasRecordDTO,
    description: 'Creates a Protocol Gas record in the workspace',
  })
  async createProtocolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: ProtocolGasBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<ProtocolGasRecordDTO> {
    const userId = 'testUser';
    return this.service.createProtocolGas(testSumId, payload, userId);
  }

  @Put(':id')
  @ApiOkResponse({
    type: ProtocolGasRecordDTO,
    description: 'Updates a Protocol Gas record in the workspace',
  })
  editProtolGas(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: ProtocolGasBaseDTO,
  ) {
    const userId = 'testUser';
    return this.service.updateProtocolGas(testSumId, id, payload, userId);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Deletes a Protocol Gas record from the workspace',
  })
  deleteProtolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = 'testUser';
    return this.service.deleteProtocolGas(testSumId, id, userId);
  }
}
