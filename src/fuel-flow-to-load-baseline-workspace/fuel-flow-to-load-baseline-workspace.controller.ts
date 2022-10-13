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
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Baseline')
export class FuelFlowToLoadBaselineWorkspaceController {
  constructor(
    private readonly service: FuelFlowToLoadBaselineWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FuelFlowToLoadBaselineDTO,
    description:
      'Retrieves workspace Fuel Flow To Load Baseline records by Test Summary Id',
  })
  async getFuelFlowToLoadBaselines(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    return this.service.getFuelFlowToLoadBaselines(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowToLoadBaselineDTO,
    description:
      'Retrieves workspace Fuel Flow To Load Baseline record by its Id',
  })
  async getFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.getFuelFlowToLoadBaseline(id, testSumId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: FuelFlowToLoadBaselineDTO,
    description: 'Creates a workspace Fuel Flow To Load Baseline record.',
  })
  async createFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FuelFlowToLoadBaselineBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.createFuelFlowToLoadBaseline(
      testSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: FuelFlowToLoadBaselineDTO,
    description: 'Updates a workspace Fuel Flow To Load Baseline record.',
  })
  updateFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FuelFlowToLoadBaselineBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.updateFuelFlowToLoadBaseline(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Linearity Summary record from the workspace',
  })
  async deleteFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFuelFlowToLoadBaseline(
      testSumId,
      id,
      user.userId,
    );
  }
}
