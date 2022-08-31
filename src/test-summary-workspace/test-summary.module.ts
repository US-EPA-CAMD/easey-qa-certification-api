import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { ProtocolGasWorkspaceModule } from '../protocol-gas-workspace/protocol-gas.module';

import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { QAMonitorPlanWorkspaceRepository } from '../qa-monitor-plan-workspace/qa-monitor-plan.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { TestResultCodeModule } from '../test-result-code/test-result-code.module';
import { TestQualificationWorkspaceModule } from '../test-qualification-workspace/test-qualification-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QASuppDataWorkspaceRepository,
      QAMonitorPlanWorkspaceRepository,
      TestSummaryWorkspaceRepository,
      ComponentWorkspaceRepository,
      AnalyzerRangeWorkspaceRepository,
      TestSummaryMasterDataRelationshipRepository,
      MonitorSystemRepository,
      MonitorMethodRepository,
    ]),
    forwardRef(() => LinearitySummaryWorkspaceModule),
    forwardRef(() => LinearityInjectionWorkspaceModule),
    forwardRef(() => ProtocolGasWorkspaceModule),
    forwardRef(() => RataWorkspaceModule),
    forwardRef(() => TestQualificationWorkspaceModule),
    TestResultCodeModule,
  ],
  controllers: [TestSummaryWorkspaceController],
  providers: [
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceService,
  ],
})
export class TestSummaryWorkspaceModule {}
