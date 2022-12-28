import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
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
  HgInjectionBaseDTO,
  HgInjectionRecordDTO,
} from '../dto/hg-injection.dto';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Injection')
export class HgInjectionWorkspaceController {
  constructor(private readonly service: HgInjectionWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: HgInjectionRecordDTO,
    description:
      'Retrieves workspace Hg Injection records by HG Test Summary Id',
  })
  async getHgInjectionsByTestSumId(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('hgTestSumId') hgTestSumId: string,
  ): Promise<HgInjectionRecordDTO[]> {
    return this.service.getHgInjectionsByHgTestSumId(hgTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: HgInjectionRecordDTO,
    description: 'Retrieves workspace Hg Injection record by its Id',
  })
  async getHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('hgTestSumId') _hgTestSumId: string,
    @Param('id') id: string,
  ): Promise<HgInjectionRecordDTO> {
    return this.service.getHgInjection(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: HgInjectionRecordDTO,
    description: 'Creates a workspace Hg Injection record.',
  })
  async createHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('hgTestSumId') hgTestSumId: string,
    @Body() payload: HgInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgInjectionRecordDTO> {
    return this.service.createHgInjection(
      testSumId,
      hgTestSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: HgInjectionRecordDTO,
    description: 'Updates a workspace Hg Injection record.',
  })
  updateHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('hgTestSumId') _hgTestSumId: string,
    @Param('id') id: string,
    @Body() payload: HgInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgInjectionRecordDTO> {
    return this.service.updateHgInjection(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a workspace HG Injection record',
  })
  async deleteHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('hgTestSumId') _cycleTimeSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteHgInjection(testSumId, id, user.userId);
  }
}
