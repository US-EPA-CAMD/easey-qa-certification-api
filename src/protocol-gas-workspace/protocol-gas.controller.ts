import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  ProtocolGasBaseDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Protocol Gas')
export class ProtocolGasWorkspaceController {
  constructor(
    private readonly service: ProtocolGasWorkspaceService,
    private readonly checksService: ProtocolGasChecksService,
  ) {}

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: ProtocolGasRecordDTO,
    description: 'Creates a Protocol Gas record in the workspace',
  })
  async createProtocolGas(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: ProtocolGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<ProtocolGasRecordDTO> {
    await this.checksService.runChecks(
      payload,
      locationId,
      testSumId,
      false,
      true,
    );
    return this.service.createProtocolGas(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: ProtocolGasRecordDTO,
    description: 'Updates a Protocol Gas record in the workspace',
  })
  async editProtolGas(
    @Param('locid') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: ProtocolGasBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(
      payload,
      locationId,
      testSumId,
      false,
      true,
    );
    return this.service.updateProtocolGas(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Protocol Gas record from the workspace',
  })
  deleteProtolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteProtocolGas(testSumId, id, user.userId);
  }
}
