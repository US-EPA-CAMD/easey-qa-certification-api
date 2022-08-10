import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataWorkspaceService } from './rata-workspace.service';

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
    const userId = 'testUser';
    return this.service.createRata(testSumId, payload, userId);
  }
}
