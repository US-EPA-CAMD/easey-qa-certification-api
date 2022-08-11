import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataWorkspaceService } from './rata-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata')
export class RataWorkspaceController {
  constructor(private readonly service: RataWorkspaceService) {}

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
