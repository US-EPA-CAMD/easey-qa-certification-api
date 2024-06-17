import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TransmitterTransducerAccuracyController } from './transmitter-transducer-accuracy.controller';
import { TransmitterTransducerAccuracyService } from './transmitter-transducer-accuracy.service';
import { TransmitterTransducerAccuracyRepository } from './transmitter-transducer-accuracy.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransmitterTransducerAccuracyRepository]),
    forwardRef(() => TestSummaryModule),
    HttpModule,
  ],
  controllers: [TransmitterTransducerAccuracyController],
  providers: [
    TransmitterTransducerAccuracyRepository,
    TransmitterTransducerAccuracyService,
    TransmitterTransducerAccuracyMap,
  ],
  exports: [
    TypeOrmModule,
    TransmitterTransducerAccuracyRepository,
    TransmitterTransducerAccuracyMap,
    TransmitterTransducerAccuracyService,
  ],
})
export class TransmitterTransducerAccuracyModule {}
