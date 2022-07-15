import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryWorkspaceModule } from './../test-summary-workspace/test-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { LinearitySummaryWorkspaceController } from './linearity-summary.controller';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinearitySummaryWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => LinearityInjectionWorkspaceModule),
  ],
  controllers: [LinearitySummaryWorkspaceController],
  providers: [
    LinearitySummaryMap,
    LinearitySummaryWorkspaceService,
    LinearitySummaryChecksService,
  ],
  exports: [
    TypeOrmModule,
    LinearitySummaryMap,
    LinearitySummaryWorkspaceService,
    LinearitySummaryChecksService,
  ],
})
export class LinearitySummaryWorkspaceModule {}
