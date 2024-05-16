import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirEmissionTestingWorkspaceModule } from '../air-emission-testing-workspace/air-emission-testing-workspace.module';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { AppEHeatInputFromGasWorkspaceModule } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.module';
import { AppEHeatInputFromOilWorkspaceModule } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.module';
import { CalibrationInjectionWorkspaceModule } from '../calibration-injection-workspace/calibration-injection-workspace.module';
import { CalibrationInjectionRepository } from '../calibration-injection/calibration-injection.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { CycleTimeSummaryWorkspaceModule } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.module';
import { FlowToLoadCheckWorkspaceModule } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.module';
import { FlowToLoadReferenceWorkspaceModule } from '../flow-to-load-reference-workspace/flow-to-load-reference-workspace.module';
import { FuelFlowToLoadBaselineWorkspaceModule } from '../fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.module';
import { FuelFlowToLoadTestWorkspaceModule } from '../fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.module';
import { FuelFlowmeterAccuracyWorkspaceModule } from '../fuel-flowmeter-accuracy-workspace/fuel-flowmeter-accuracy-workspace.module';
import { HgInjectionWorkspaceModule } from '../hg-injection-workspace/hg-injection-workspace.module';
import { HgSummaryWorkspaceModule } from '../hg-summary-workspace/hg-summary-workspace.module';
import { HgSummaryRepository } from '../hg-summary/hg-summary.repository';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { LinearitySummaryWorkspaceModule } from '../linearity-summary-workspace/linearity-summary.module';
import { TestSummaryMap } from '../maps/test-summary.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorMethodWorkspaceRepository } from '../monitor-method-workspace/monitor-method-workspace.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { OnlineOfflineCalibrationWorkspaceModule } from '../online-offline-calibration-workspace/online-offline-calibration.module';
import { ProtocolGasWorkspaceModule } from '../protocol-gas-workspace/protocol-gas.module';
import { QAMonitorPlanWorkspaceRepository } from '../qa-monitor-plan-workspace/qa-monitor-plan.repository';
import { QASuppDataWorkspaceModule } from '../qa-supp-data-workspace/qa-supp-data.module';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { TestQualificationWorkspaceModule } from '../test-qualification-workspace/test-qualification-workspace.module';
import { TestResultCodeModule } from '../test-result-code/test-result-code.module';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { TransmitterTransducerAccuracyWorkspaceModule } from '../transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.module';
import { TransmitterTransducerAccuracyRepository } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.repository';
import { UnitDefaultTestWorkspaceModule } from '../unit-default-test-workspace/unit-default-test-workspace.module';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';

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
      MonitorSystemWorkspaceRepository,
      ReportingPeriodRepository,
      MonitorLocationRepository,
      MonitorMethodWorkspaceRepository,
      CalibrationInjectionRepository,
      TransmitterTransducerAccuracyRepository,
      HgSummaryRepository,
    ]),
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
    AnalyzerRangeWorkspaceRepository,
    CalibrationInjectionRepository,
    ComponentWorkspaceRepository,
    HgSummaryRepository,
    MonitorLocationRepository,
    MonitorMethodWorkspaceRepository,
    MonitorSystemRepository,
    MonitorSystemWorkspaceRepository,
    QASuppDataWorkspaceRepository,
    QAMonitorPlanWorkspaceRepository,
    ReportingPeriodRepository,
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceService,
    TestSummaryWorkspaceRepository,
    TestSummaryMasterDataRelationshipRepository,
    TransmitterTransducerAccuracyRepository,
  ],
  exports: [
    TypeOrmModule,
    TestSummaryMap,
    TestSummaryChecksService,
    TestSummaryWorkspaceService,
  ],
})
export class TestSummaryWorkspaceModule {}
