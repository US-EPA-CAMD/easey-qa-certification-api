import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppendixETestSummaryWorkspaceController } from './app-e-correlation-test-summary-workspace.controller';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';
import { AppECorrelationTestSummaryModule } from 'src/app-e-correlation-test-summary/app-e-correlation-test-summary.module';
import { AppECorrelationTestRunModule } from 'src/app-e-correlation-test-run/app-e-correlation-test-run.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppendixETestSummaryWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryModule),
    forwardRef(() => AppECorrelationTestRunModule),
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
