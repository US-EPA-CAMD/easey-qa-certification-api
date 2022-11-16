import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TransmitterTransducerAccuracyService } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.service';
import { ProtocolGasRecordDTO } from '../dto/protocol-gas.dto';
import {
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Transmitter Transducer Accuracy')
export class TransmitterTransducerAccuracyController {
  constructor(private readonly service: TransmitterTransducerAccuracyService) {
  }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TransmitterTransducerAccuracyRecordDTO,
    description: 'Retrieves official Transmitter Transducer Accuracy records by Test Summary Id',
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
    description: 'Retrieves official Transmitter Transducer Accuracy record by its Id',
  })
  getTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getTransmitterTransducerAccuracy(id);
  }
}