import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TransmitterTransducerAccuracyWorkspaceController } from './transmitter-transducer-accuracy.controller';
import { TransmitterTransducerAccuracyWorkspaceService } from './transmitter-transducer-accuracy.service';
import { TransmitterTransducerAccuracyWorkspaceRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracyModule } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransmitterTransducerAccuracyWorkspaceRepository,
    ]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => TransmitterTransducerAccuracyModule),
    HttpModule,
  ],
  controllers: [TransmitterTransducerAccuracyWorkspaceController],
  providers: [
    TransmitterTransducerAccuracyWorkspaceService,
    TransmitterTransducerAccuracyMap,
  ],
  exports: [
    TypeOrmModule,
    TransmitterTransducerAccuracyMap,
    TransmitterTransducerAccuracyWorkspaceService,
  ],
})
export class TransmitterTransducerAccuracyWorkspaceModule {}
