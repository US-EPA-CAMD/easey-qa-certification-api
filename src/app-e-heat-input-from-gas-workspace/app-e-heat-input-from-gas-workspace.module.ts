import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';
import { AppEHeatInputFromGasWorkspaceController } from './app-e-heat-input-from-gas-workspace.controller';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { AppEHeatInputFromGasModule } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.module';
import { AppEHeatInputFromGasChecksService } from './app-e-heat-input-from-gas-checks.service';
import { AppECorrelationTestRunWorkspaceModule } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputFromGasWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestRunWorkspaceModule),
    forwardRef(() => AppEHeatInputFromGasModule),

    HttpModule,
  ],
  controllers: [AppEHeatInputFromGasWorkspaceController],
  providers: [
    AppEHeatInputFromGasWorkspaceService,
    AppEHeatInputFromGasMap,
    AppEHeatInputFromGasChecksService,
  ],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromGasMap,
    AppEHeatInputFromGasWorkspaceService,
    AppEHeatInputFromGasChecksService,
  ],
})
export class AppEHeatInputFromGasWorkspaceModule {}
