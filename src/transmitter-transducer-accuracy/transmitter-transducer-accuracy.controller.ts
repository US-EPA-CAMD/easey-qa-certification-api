import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { TransmitterTransducerAccuracyService } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.service';
import { ProtocolGasRecordDTO } from '../dto/protocol-gas.dto';
import {
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Transmitter Transducer Accuracy')
@ApiExtraModels(TransmitterTransducerAccuracyDTO)
export class TransmitterTransducerAccuracyController {
  constructor(private readonly service: TransmitterTransducerAccuracyService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official Transmitter Transducer Accuracy records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(TransmitterTransducerAccuracyDTO) },
              },
            },
          },
        },
      }
  })
  async getTransmitterTransducerAccuracies(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) : Promise<ArrayResponse<TransmitterTransducerAccuracyDTO>>  {
    const transducerAccuracyDTOS = await this.service.getTransmitterTransducerAccuracies(testSumId);

    return  { items: transducerAccuracyDTOS };
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
}
