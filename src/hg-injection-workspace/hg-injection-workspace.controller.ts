import {
  Body,
  Controller,
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
import { HgInjectionBaseDTO, HgInjectionDTO } from 'src/dto/hg-injection.dto';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Injection')
export class HgInjectionWorkspaceController {
  constructor(private readonly service: HgInjectionWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: HgInjectionDTO,
    description:
      'Retrieves workspace Hg Injection records by HG Test Summary Id',
  })
  async getHgInjections(
    @Param('locId') _locationId: string,
    @Param('hgTestSumId') hgTestSumId: string,
  ): Promise<HgInjectionDTO[]> {
    return this.service.getHgInjections(hgTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: HgInjectionDTO,
    description: 'Retrieves workspace Hg Injection record by its Id',
  })
  async getHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') hgTestSumId: string,
    @Param('id') id: string,
  ): Promise<HgInjectionDTO> {
    return this.service.getHgInjection(id, hgTestSumId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: HgInjectionDTO,
    description: 'Creates a workspace Hg Injection record.',
  })
  createHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: HgInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgInjectionDTO> {
    return this.service.createHgInjection(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: HgInjectionDTO,
    description: 'Updates a workspace Hg Injection record.',
  })
  updateHgInjection(
    @Param('locId') _locationId: string,
    @Param('hgTestSumId') hgTestSumId: string,
    @Param('id') id: string,
    @Body() payload: HgInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgInjectionDTO> {
    return this.service.updateHgInjection(
      id,
      hgTestSumId,
      payload,
      user.userId,
    );
  }
}
