import { forwardRef, Module } from '@nestjs/common';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';
import { AppECorrelationTestRunWorkspaceController } from './app-e-correlation-test-run-workspace.controller';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { HttpModule } from '@nestjs/axios';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { AppEHeatInputFromOilWorkspaceModule } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.module';
import { AppEHeatInputFromGasWorkspaceModule } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppECorrelationTestRunWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryWorkspaceModule),
    AppEHeatInputFromOilWorkspaceModule,
    AppEHeatInputFromGasWorkspaceModule,
    HttpModule,
  ],
  controllers: [AppECorrelationTestRunWorkspaceController],
  providers: [
    AppECorrelationTestRunMap,
    AppECorrelationTestRunWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    AppECorrelationTestRunMap,
    AppECorrelationTestRunWorkspaceService,
  ],
})
export class AppECorrelationTestRunWorkspaceModule {}
