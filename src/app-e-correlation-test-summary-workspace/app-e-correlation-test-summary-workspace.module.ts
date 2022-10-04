import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppendixETestSummaryWorkspaceController } from './app-e-correlation-test-summary-workspace.controller';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';
import { AppECorrelationTestRunWorkspaceModule } from 'src/app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppendixETestSummaryWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestRunWorkspaceModule),
    HttpModule,
  ],
  controllers: [AppendixETestSummaryWorkspaceController],
  providers: [
    AppECorrelationTestSummaryMap,
    AppECorrelationTestSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    AppECorrelationTestSummaryMap,
    AppECorrelationTestSummaryWorkspaceService,
  ],
})
export class AppECorrelationTestSummaryWorkspaceModule {}
