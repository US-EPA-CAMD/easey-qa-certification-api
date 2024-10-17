import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirEmissionTestingWorkspaceModule } from '../air-emission-testing-workspace/air-emission-testing-workspace.module';
import { AnalyzerRangeModule } from '../analyzer-range-workspace/analyzer-range.module';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { AppEHeatInputFromGasWorkspaceModule } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.module';
import { AppEHeatInputFromOilWorkspaceModule } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.module';
import { CalibrationInjectionWorkspaceModule } from '../calibration-injection-workspace/calibration-injection-workspace.module';
import { CalibrationInjectionModule } from '../calibration-injection/calibration-injection.module';
import { ComponentModule } from '../component-workspace/component.module';
import { CycleTimeSummaryWorkspaceModule } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.module';
import { FlowToLoadCheckWorkspaceModule } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.module';
import { FlowToLoadReferenceWorkspaceModule } from '../flow-to-load-reference-workspace/flow-to-load-reference-workspace.module';
import { FuelFlowToLoadBaselineWorkspaceModule } from '../fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.module';
import { FuelFlowToLoadTestWorkspaceModule } from '../fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.module';
import { FuelFlowmeterAccuracyWorkspaceModule } from '../fuel-flowmeter-accuracy-workspace/fuel-flowmeter-accuracy-workspace.module';
import { HgInjectionWorkspaceModule } from '../hg-injection-workspace/hg-injection-workspace.module';
import { HgSummaryWorkspaceModule } from '../hg-summary-workspace/hg-summary-workspace.module';
import { HgSummaryModule } from '../hg-summary/hg-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { TestSummaryMap } from '../maps/test-summary.map';
import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorMethodWorkspaceModule } from '../monitor-method-workspace/monitor-method-workspace.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { OnlineOfflineCalibrationWorkspaceModule } from '../online-offline-calibration-workspace/online-offline-calibration.module';
import { ProtocolGasWorkspaceModule } from '../protocol-gas-workspace/protocol-gas.module';
import { QAMonitorPlanWorkspaceModule } from '../qa-monitor-plan-workspace/qa-monitor-plan.module';
import { QASuppDataWorkspaceModule } from '../qa-supp-data-workspace/qa-supp-data.module';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';
import { ReportingPeriodModule } from '../reporting-period/reporting-period.module';
import { TestQualificationWorkspaceModule } from '../test-qualification-workspace/test-qualification-workspace.module';
import { TestResultCodeModule } from '../test-result-code/test-result-code.module';
import { TestSummaryMasterDataRelationshipModule } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.module';
import { TransmitterTransducerAccuracyWorkspaceModule } from '../transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.module';
import { TransmitterTransducerAccuracyModule } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.module';
import { UnitDefaultTestWorkspaceModule } from '../unit-default-test-workspace/unit-default-test-workspace.module';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { TestSummaryReviewAndSubmitService } from '../qa-certification-workspace/test-summary-review-and-submit.service';
import { TestSummaryReviewAndSubmitRepository } from '../qa-certification-workspace/test-summary-review-and-submit.repository';
import { TestSummaryReviewAndSubmitGlobalRepository } from '../qa-certification-workspace/test-summary-review-and-submit-global.repository';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';


@Module({
  imports: [
    TypeOrmModule.forFeature([TestSummaryWorkspaceRepository, TestSummaryReviewAndSubmitRepository, TestSummaryReviewAndSubmitGlobalRepository]),
    ComponentModule,
    AnalyzerRangeModule,
    TestSummaryMasterDataRelationshipModule,
    MonitorSystemModule,
    MonitorSystemWorkspaceModule,
    ReportingPeriodModule,
    MonitorLocationModule,
    MonitorMethodWorkspaceModule,
    CalibrationInjectionModule,
    TransmitterTransducerAccuracyModule,
    HgSummaryModule,
    forwardRef(() => QAMonitorPlanWorkspaceModule),
    forwardRef(() => LinearitySummaryWorkspaceModule),
    forwardRef(() => LinearityInjectionWorkspaceModule),
    forwardRef(() => ProtocolGasWorkspaceModule),
    forwardRef(() => RataWorkspaceModule),
    forwardRef(() => TestQualificationWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryWorkspaceModule),
    forwardRef(() => FlowToLoadReferenceWorkspaceModule),
    forwardRef(() => FuelFlowToLoadTestWorkspaceModule),
    forwardRef(() => FuelFlowmeterAccuracyWorkspaceModule),
    forwardRef(() => FlowToLoadCheckWorkspaceModule),
    forwardRef(() => AirEmissionTestingWorkspaceModule),
    forwardRef(() => AppEHeatInputFromGasWorkspaceModule),
    forwardRef(() => AppEHeatInputFromOilWorkspaceModule),
    forwardRef(() => CalibrationInjectionWorkspaceModule),
    forwardRef(() => FuelFlowToLoadBaselineWorkspaceModule),
    forwardRef(() => OnlineOfflineCalibrationWorkspaceModule),
    forwardRef(() => CycleTimeSummaryWorkspaceModule),
    forwardRef(() => UnitDefaultTestWorkspaceModule),
    forwardRef(() => TransmitterTransducerAccuracyWorkspaceModule),
    forwardRef(() => HgSummaryWorkspaceModule),
    forwardRef(() => HgInjectionWorkspaceModule),
    forwardRef(() => QASuppDataWorkspaceModule),
    TestResultCodeModule,
    HttpModule,
  ],
  controllers: [TestSummaryWorkspaceController],
  providers: [
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceService,
    TestSummaryWorkspaceRepository,
    TestSummaryReviewAndSubmitService,
    TestSummaryReviewAndSubmitRepository,
    TestSummaryReviewAndSubmitGlobalRepository,
    ReviewAndSubmitTestSummaryMap,
  ],
  exports: [
    TypeOrmModule,
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceRepository,
    TestSummaryWorkspaceService,
  ],
})
export class TestSummaryWorkspaceModule {}
