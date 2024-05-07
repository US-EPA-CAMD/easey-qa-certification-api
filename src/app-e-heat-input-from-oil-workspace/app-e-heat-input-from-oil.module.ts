import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppECorrelationTestRunWorkspaceModule } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.module';
import { AppEHeatInputFromOilModule } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.module';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppEHeatInputFromOilChecksService } from './app-e-heat-input-from-oil-checks.service';
import { AppEHeatInputFromOilWorkspaceController } from './app-e-heat-input-from-oil.controller';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputFromOilWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => MonitorSystemWorkspaceModule),
    forwardRef(() => AppECorrelationTestRunWorkspaceModule),
    forwardRef(() => AppEHeatInputFromOilModule),
    HttpModule,
  ],
  controllers: [AppEHeatInputFromOilWorkspaceController],
  providers: [
    AppEHeatInputFromOilWorkspaceRepository,
    AppEHeatInputFromOilWorkspaceService,
    AppEHeatInputFromOilMap,
    AppEHeatInputFromOilChecksService,
  ],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromOilMap,
    AppEHeatInputFromOilWorkspaceService,
    AppEHeatInputFromOilChecksService,
  ],
})
export class AppEHeatInputFromOilWorkspaceModule {}
