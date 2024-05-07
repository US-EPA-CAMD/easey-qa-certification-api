import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionModule } from '../linearity-injection/linearity-injection.module';
import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';
import { LinearityInjectionWorkspaceController } from './linearity-injection.controller';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinearityInjectionWorkspaceRepository]),
    forwardRef(() => LinearityInjectionModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => LinearitySummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [LinearityInjectionWorkspaceController],
  providers: [
    LinearityInjectionMap,
    LinearityInjectionWorkspaceRepository,
    LinearityInjectionWorkspaceService,
    LinearityInjectionChecksService,
  ],
  exports: [
    TypeOrmModule,
    LinearityInjectionMap,
    LinearityInjectionWorkspaceService,
    LinearityInjectionChecksService,
  ],
})
export class LinearityInjectionWorkspaceModule {}
