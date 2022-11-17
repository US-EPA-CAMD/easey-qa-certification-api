import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TransmitterTransducerAccuracyWorkspaceController } from './transmitter-transducer-accuracy.controller';
import { TransmitterTransducerAccuracyWorkspaceService } from './transmitter-transducer-accuracy.service';
import { TransmitterTransducerAccuracyWorkspaceRepository } from './transmitter-transducer-accuracy.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransmitterTransducerAccuracyWorkspaceRepository,
    ]),
    forwardRef(() => TestSummaryWorkspaceModule),
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
