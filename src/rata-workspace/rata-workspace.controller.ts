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
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataChecksService } from './rata-checks.service';
import { RataWorkspaceService } from './rata-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata')
export class RataWorkspaceController {
  constructor(
    private readonly service: RataWorkspaceService,
    private readonly checksService: RataChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataRecordDTO,
    description: 'Retrieves workspace RATA records by Test Summary Id',
  })
  async getRatas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<RataRecordDTO[]> {
    return this.service.getRatasByTestSumId(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: RataRecordDTO,
    description: 'Retrieves workspace RATA record by its Id',
  })
  async getRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<RataRecordDTO> {
    return this.service.getRataById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: RataRecordDTO,
    description: 'Creates a Rata record in the workspace',
  })
  async createRata(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: RataBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(locationId, payload, testSumId);
    return this.service.createRata(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: RataRecordDTO,
    description: 'Updates a Rata record in the workspace',
  })
  async updateRata(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: RataBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      testSumId,
      false,
      true,
    );
    return this.service.updateRata(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a RATA record from the workspace',
  })
  async deleteRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteRata(testSumId, id, user.userId);
  }
}
