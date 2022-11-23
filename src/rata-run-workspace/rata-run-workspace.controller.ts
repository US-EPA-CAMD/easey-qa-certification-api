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
  RataRunBaseDTO,
  RataRunDTO,
  RataRunRecordDTO,
} from '../dto/rata-run.dto';
import { RataRunChecksService } from './rata-run-checks.service';
import { RataRunWorkspaceService } from './rata-run-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Run')
export class RataRunWorkspaceController {
  constructor(
    private readonly service: RataRunWorkspaceService,
    private readonly checksService: RataRunChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataRunDTO,
    description: 'Get many Rata Run record in the workspace by Rata Summary Id',
  })
  async getRataRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') rataSumId: string,
  ): Promise<RataRunDTO[]> {
    return this.service.getRataRuns(rataSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataRunDTO,
    description: 'Get a Rata Run record in the workspace',
  })
  async getRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('id') rataRunId: string,
  ): Promise<RataRunDTO> {
    return this.service.getRataRun(rataRunId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    isArray: false,
    type: RataRunRecordDTO,
    description: 'Creates a Rata Run record in the workspace',
  })
  async createRataRun(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') rataSumId: string,
    @Body() payload: RataRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRunRecordDTO> {
    await this.checksService.runChecks(
      payload,
      locationId,
      testSumId,
      false,
      false,
      null,
      rataSumId,
    );
    return this.service.createRataRun(
      testSumId,
      rataSumId,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Rata Run record from the workspace',
  })
  deleteRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteRataRun(testSumId, id, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: RataRunRecordDTO,
    description: 'Updates a Rata Run record in the workspace',
  })
  async updateRataRun(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('id') id: string,
    @Body() payload: RataRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRunRecordDTO> {
    await this.checksService.runChecks(
      payload,
      locationId,
      testSumId,
      false,
      true,
    );
    return this.service.updateRataRun(testSumId, id, payload, user.userId);
  }
}
