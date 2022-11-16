import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { TransmitterTransducerAccuracyWorkspaceService } from '../transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Transmitter Transducer Accuracy')
export class TransmitterTransducerAccuracyWorkspaceController {
  constructor(
    private readonly service: TransmitterTransducerAccuracyWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TransmitterTransducerAccuracyRecordDTO,
    description:
      'Retrieves workspace Transmitter Transducer Accuracy records by Test Summary Id',
  })
  getTransmitterTransducerAccuracies(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) {
    return this.service.getTransmitterTransducerAccuracies(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: TransmitterTransducerAccuracyDTO,
    description:
      'Retrieves official Transmitter Transducer Accuracy record by its Id',
  })
  getTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getTransmitterTransducerAccuracy(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: TransmitterTransducerAccuracyRecordDTO,
    description:
      'Creates a Transmitter Transducer Accuracy record in the workspace',
  })
  async createTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: TransmitterTransducerAccuracyBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TransmitterTransducerAccuracyRecordDTO> {
    return this.service.createTransmitterTransducerAccuracy(
      testSumId,
      payload,
      user.userId,
    );
  }
}