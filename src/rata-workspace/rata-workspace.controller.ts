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
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataChecksService } from './rata-checks.service';
import { RataWorkspaceService } from './rata-workspace.service';

const userId = 'testUser';

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
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: RataRecordDTO,
    description: 'Creates a Rata record in the workspace',
  })
  async createRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: RataBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(testSumId, payload);
    return this.service.createRata(testSumId, payload, userId);
  }

  @Put(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: RataRecordDTO,
    description: 'Updates a Rata record in the workspace',
  })
  async updateRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: RataBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(testSumId, payload, false, true);
    return this.service.updateRata(testSumId, id, payload, userId);
  }

  @Delete(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Deletes a RATA record from the workspace',
  })
  async deleteRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    //    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.service.deleteRata(testSumId, id, userId);
  }
}
