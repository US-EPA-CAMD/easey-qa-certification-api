import { HttpModule } from '@nestjs/axios';
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
import { AirEmissionTestingWorkspaceModule } from '../air-emission-testing-workspace/air-emission-testing-workspace.module';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { FuelFlowToLoadTestWorkspaceModule } from '../fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.module';
import { FlowToLoadCheckWorkspaceModule } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.module';
import { FlowToLoadReferenceWorkspaceModule } from '../flow-to-load-reference-workspace/flow-to-load-reference-workspace.module';
import { CalibrationInjectionWorkspaceModule } from '../calibration-injection-workspace/calibration-injection-workspace.module';
import { AppEHeatInputFromGasWorkspaceModule } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.module';
import { AppEHeatInputFromOilWorkspaceModule } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.module';
import { FuelFlowToLoadBaselineWorkspaceModule } from '../fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.module';
import { CalibrationInjectionRepository } from '../calibration-injection/calibration-injection.repository';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { OnlineOfflineCalibrationWorkspaceModule } from '../online-offline-calibration-workspace/online-offline-calibration.module';

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
      ReportingPeriodRepository,
      MonitorLocationRepository,
      UnitRepository,
      StackPipeRepository,
      MonitorMethodRepository,
      CalibrationInjectionRepository,
    ]),
    forwardRef(() => LinearitySummaryWorkspaceModule),
    forwardRef(() => LinearityInjectionWorkspaceModule),
    forwardRef(() => ProtocolGasWorkspaceModule),
    forwardRef(() => RataWorkspaceModule),
    forwardRef(() => TestQualificationWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryWorkspaceModule),
    forwardRef(() => FlowToLoadReferenceWorkspaceModule),
    forwardRef(() => FuelFlowToLoadTestWorkspaceModule),
    forwardRef(() => FlowToLoadCheckWorkspaceModule),
    forwardRef(() => AirEmissionTestingWorkspaceModule),
    forwardRef(() => AppEHeatInputFromGasWorkspaceModule),
    forwardRef(() => AppEHeatInputFromOilWorkspaceModule),
    forwardRef(() => CalibrationInjectionWorkspaceModule),
    forwardRef(() => FuelFlowToLoadBaselineWorkspaceModule),
    forwardRef(() => OnlineOfflineCalibrationWorkspaceModule),
    TestResultCodeModule,
    HttpModule,
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
