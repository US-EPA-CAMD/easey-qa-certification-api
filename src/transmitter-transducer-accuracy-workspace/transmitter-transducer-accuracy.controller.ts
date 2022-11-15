import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TransmitterTransducerAccuracyWorkspaceService } from '../transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { TransmitterTransducerAccuracyBaseDTO, TransmitterTransducerAccuracyRecordDTO } from '../dto/transmitter-transducer-accuracy.dto';
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';


@Controller()
@ApiSecurity('APIKey')
@ApiTags('Transmitter Transducer Accuracy')
export class TransmitterTransducerAccuracyWorkspaceController {
  constructor(private readonly service: TransmitterTransducerAccuracyWorkspaceService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: TransmitterTransducerAccuracyRecordDTO,
    description: 'Creates a Transmitter Transducer Accuracy record in the workspace',
  })
  async createTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: TransmitterTransducerAccuracyBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TransmitterTransducerAccuracyRecordDTO> {
    return this.service.createTransmitterTransducerAccuracy(testSumId, payload, user.userId);
  }

}