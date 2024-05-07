import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TransmitterTransducerAccuracyModule } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.module';
import { TransmitterTransducerAccuracyWorkspaceController } from './transmitter-transducer-accuracy.controller';
import { TransmitterTransducerAccuracyWorkspaceRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracyWorkspaceService } from './transmitter-transducer-accuracy.service';

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
    TransmitterTransducerAccuracyWorkspaceRepository,
    TransmitterTransducerAccuracyMap,
  ],
  exports: [
    TypeOrmModule,
    TransmitterTransducerAccuracyMap,
    TransmitterTransducerAccuracyWorkspaceService,
  ],
})
export class TransmitterTransducerAccuracyWorkspaceModule {}
