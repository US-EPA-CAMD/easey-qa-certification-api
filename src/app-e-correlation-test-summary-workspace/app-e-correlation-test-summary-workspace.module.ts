import { forwardRef, Module } from '@nestjs/common';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppendixETestSummaryWorkspaceController } from './app-e-correlation-test-summary-workspace.controller';
import { AeCorrelationSummaryMap } from '../maps/app-e-correlation-summary.map';
import { HttpModule } from '@nestjs/axios';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppendixETestSummaryWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [AppendixETestSummaryWorkspaceController],
  providers: [
    AeCorrelationSummaryMap,
    AppECorrelationTestSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    AeCorrelationSummaryMap,
    AppECorrelationTestSummaryWorkspaceService,
  ],
})
export class AppECorrelationTestSummaryWorkspaceModule {}
