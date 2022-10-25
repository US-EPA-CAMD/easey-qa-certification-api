import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { RataWorkspaceService } from './rata-workspace.service';
import { RataWorkspaceController } from './rata-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataMap } from '../maps/rata.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataChecksService } from './rata-checks.service';
import { RataFrequencyCodeModule } from '../rata-frequency-code/rata-frequency-code.module';
import { RataModule } from '../rata/rata.module';
import { TestResultCodeModule } from '../test-result-code/test-result-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    forwardRef(() => RataModule),
    RataFrequencyCodeModule,
    TestResultCodeModule,
    HttpModule,
  ],
  controllers: [RataWorkspaceController],
  providers: [RataMap, RataChecksService, RataWorkspaceService],
  exports: [TypeOrmModule, RataMap, RataChecksService, RataWorkspaceService],
})
export class RataWorkspaceModule {}
