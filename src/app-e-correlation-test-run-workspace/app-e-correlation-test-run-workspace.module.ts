import { forwardRef, Module } from '@nestjs/common';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';
import { AppECorrelationTestRunWorkspaceController } from './app-e-correlation-test-run-workspace.controller';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { HttpModule } from '@nestjs/axios';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppECorrelationTestRunWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryWorkspaceModule),
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