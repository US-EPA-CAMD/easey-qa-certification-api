import { forwardRef, Module } from '@nestjs/common';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppendixETestSummaryWorkspaceController } from './app-e-correlation-test-summary-workspace.controller';
import { AeCorrelationSummaryMap } from 'src/maps/ae-correlation-summary.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppECorrelationTestSummaryWorkspaceService]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [AppendixETestSummaryWorkspaceController],
  providers: [AeCorrelationSummaryMap, AppECorrelationTestSummaryWorkspaceService],
  exports: [
    TypeOrmModule,
    AeCorrelationSummaryMap,
    AppECorrelationTestSummaryWorkspaceService,
  ],
})
export class AppECorrelationTestSummaryWorkspaceModule {}