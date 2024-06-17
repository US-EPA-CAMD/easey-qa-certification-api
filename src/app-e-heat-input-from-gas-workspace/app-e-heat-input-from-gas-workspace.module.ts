import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppECorrelationTestRunWorkspaceModule } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.module';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { AppEHeatInputFromGasModule } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.module';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppEHeatInputFromGasChecksService } from './app-e-heat-input-from-gas-checks.service';
import { AppEHeatInputFromGasWorkspaceController } from './app-e-heat-input-from-gas-workspace.controller';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputFromGasWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => MonitorSystemWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestRunWorkspaceModule),
    forwardRef(() => AppEHeatInputFromGasModule),

    HttpModule,
  ],
  controllers: [AppEHeatInputFromGasWorkspaceController],
  providers: [
    AppEHeatInputFromGasWorkspaceRepository,
    AppEHeatInputFromGasWorkspaceService,
    AppEHeatInputFromGasMap,
    AppEHeatInputFromGasChecksService,
  ],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromGasWorkspaceRepository,
    AppEHeatInputFromGasMap,
    AppEHeatInputFromGasWorkspaceService,
    AppEHeatInputFromGasChecksService,
  ],
})
export class AppEHeatInputFromGasWorkspaceModule {}
