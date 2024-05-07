import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { CheckCatalogModule } from '@us-epa-camd/easey-common/check-catalog';
import { dbConfig } from '@us-epa-camd/easey-common/config';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CorsOptionsModule } from '@us-epa-camd/easey-common/cors-options';
import {
  DbLookupValidator,
  IsValidCodesValidator,
} from '@us-epa-camd/easey-common/validators';

import routes from './routes';
import appConfig from './config/app.config';
import { TypeOrmConfigService } from './config/typeorm.config';

import { QACertificationModule } from './qa-certification/qa-certification.module';
import { QACertificationWorkspaceModule } from './qa-certification-workspace/qa-certification.module';

import { LocationWorkspaceModule } from './monitor-location-workspace/monitor-location.module';
import { ComponentModule } from './component-workspace/component.module';
import { AnalyzerRangeModule } from './analyzer-range-workspace/analyzer-range.module';
import { RataModule } from './rata/rata.module';
import { RataWorkspaceModule } from './rata-workspace/rata-workspace.module';
import { MonitorSystemModule } from './monitor-system/monitor-system.module';
import { MonitorMethodWorkspaceModule } from './monitor-method-workspace/monitor-method-workspace.module';
import { RataSummaryWorkspaceModule } from './rata-summary-workspace/rata-summary-workspace.module';
import { RataSummaryModule } from './rata-summary/rata-summary.module';
import { RataRunModule } from './rata-run/rata-run.module';
import { RataRunWorkspaceModule } from './rata-run-workspace/rata-run-workspace.module';
import { TestQualificationModule } from './test-qualification/test-qualification.module';
import { TestQualificationWorkspaceModule } from './test-qualification-workspace/test-qualification-workspace.module';
import { AirEmissionTestingModule } from './air-emission-testing/air-emission-testing.module';
import { AirEmissionTestingWorkspaceModule } from './air-emission-testing-workspace/air-emission-testing-workspace.module';
import { FlowRataRunModule } from './flow-rata-run/flow-rata-run.module';
import { FlowRataRunWorkspaceModule } from './flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataTraverseWorkspaceModule } from './rata-traverse-workspace/rata-traverse-workspace.module';
import { RataTraverseModule } from './rata-traverse/rata-traverse.module';
import { FuelFlowToLoadTestModule } from './fuel-flow-to-load-test/fuel-flow-to-load-test.module';
import { FuelFlowToLoadTestWorkspaceModule } from './fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.module';
import { AppECorrelationTestRunModule } from './app-e-correlation-test-run/app-e-correlation-test-run.module';
import { AppECorrelationTestRunWorkspaceModule } from './app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.module';
import { AppEHeatInputFromGasModule } from './app-e-heat-input-from-gas/app-e-heat-input-from-gas.module';
import { AppEHeatInputFromGasWorkspaceModule } from './app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.module';
import { AppEHeatInputFromOilModule } from './app-e-heat-input-from-oil/app-e-heat-input-from-oil.module';
import { AppEHeatInputFromOilWorkspaceModule } from './app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.module';
import { AppECorrelationTestSummaryWorkspaceModule } from './app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { AppECorrelationTestSummaryModule } from './app-e-correlation-test-summary/app-e-correlation-test-summary.module';
import { FlowToLoadCheckWorkspaceModule } from './flow-to-load-check-workspace/flow-to-load-check-workspace.module';
import { FlowToLoadCheckModule } from './flow-to-load-check/flow-to-load-check.module';
import { FlowToLoadReferenceWorkspaceModule } from './flow-to-load-reference-workspace/flow-to-load-reference-workspace.module';
import { FlowToLoadReferenceModule } from './flow-to-load-reference/flow-to-load-reference.module';
import { FuelFlowToLoadBaselineWorkspaceModule } from './fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.module';
import { FuelFlowToLoadBaselineModule } from './fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.module';
import { CalibrationInjectionWorkspaceModule } from './calibration-injection-workspace/calibration-injection-workspace.module';
import { CalibrationInjectionModule } from './calibration-injection/calibration-injection.module';
import { OnlineOfflineCalibrationModule } from './online-offline-calibration/online-offline-calibration.module';
import { OnlineOfflineCalibrationWorkspaceModule } from './online-offline-calibration-workspace/online-offline-calibration.module';
import { MonitorLocationModule } from './monitor-location/monitor-location.module';
import { ReportingPeriodModule } from './reporting-period/reporting-period.module';
import { FuelFlowmeterAccuracyWorkspaceModule } from './fuel-flowmeter-accuracy-workspace/fuel-flowmeter-accuracy-workspace.module';
import { FuelFlowmeterAccuracyModule } from './fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.module';
import { CycleTimeSummaryWorkspaceModule } from './cycle-time-summary-workspace/cycle-time-summary-workspace.module';
import { CycleTimeSummaryModule } from './cycle-time-summary/cycle-time-summary.module';
import { CycleTimeInjectionModule } from './cycle-time-injection/cycle-time-injection.module';
import { CycleTimeInjectionWorkspaceModule } from './cycle-time-injection-workspace/cycle-time-injection-workspace.module';
import { TransmitterTransducerAccuracyModule } from './transmitter-transducer-accuracy/transmitter-transducer-accuracy.module';
import { TransmitterTransducerAccuracyWorkspaceModule } from './transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.module';
import { UnitDefaultTestWorkspaceModule } from './unit-default-test-workspace/unit-default-test-workspace.module';
import { UnitDefaultTestModule } from './unit-default-test/unit-default-test.module';
import { UnitDefaultTestRunWorkspaceModule } from './unit-default-test-run-workspace/unit-default-test-run.module';
import { UnitDefaultTestRunModule } from './unit-default-test-run/unit-default-test-run.module';
import { HgSummaryWorkspaceModule } from './hg-summary-workspace/hg-summary-workspace.module';
import { HgInjectionWorkspaceModule } from './hg-injection-workspace/hg-injection-workspace.module';
import { HgSummaryModule } from './hg-summary/hg-summary.module';
import { HgInjectionModule } from './hg-injection/hg-injection.module';
import { QaCertificationEventWorkspaceModule } from './qa-certification-event-workspace/qa-certification-event-workspace.module';
import { MonitorSystemWorkspaceModule } from './monitor-system-workspace/monitor-system-workspace.module';
import { TestExtensionExemptionsWorkspaceModule } from './test-extension-exemptions-workspace/test-extension-exemptions-workspace.module';
import { TestExtensionExemptionsModule } from './test-extension-exemptions/test-extension-exemptions.module';
import { QaCertificationEventModule } from './qa-certification-event/qa-certification-event.module';
import { GasComponentCodeModule } from './gas-component-code/gas-component-code.module';
import { ReferenceMethodCodeModule } from './reference-method-code/reference-method-code.module';
import { GasTypeCodeModule } from './gas-type-code/gas-type-code.module';
import { CrossCheckCatalogValueModule } from './cross-check-catalog-value/cross-check-catalog-value.module';
import { WhatHasDataModule } from './what-has-data/what-has-data.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CheckCatalogModule.register(
      'camdecmpsmd.vw_qa_certification_api_check_catalog_results',
    ),
    HttpModule,
    LoggerModule,
    CorsOptionsModule,
    QACertificationModule,
    QACertificationWorkspaceModule,
    LocationWorkspaceModule,
    ComponentModule,
    AnalyzerRangeModule,
    RataModule,
    RataWorkspaceModule,
    MonitorSystemModule,
    MonitorMethodWorkspaceModule,
    RataSummaryWorkspaceModule,
    RataSummaryModule,
    RataRunModule,
    RataRunWorkspaceModule,
    FlowRataRunModule,
    FlowRataRunWorkspaceModule,
    TestQualificationModule,
    TestQualificationWorkspaceModule,
    AirEmissionTestingWorkspaceModule,
    AirEmissionTestingModule,
    RataTraverseWorkspaceModule,
    RataTraverseModule,
    FlowToLoadCheckModule,
    FlowToLoadCheckWorkspaceModule,
    FlowToLoadReferenceModule,
    FlowToLoadReferenceWorkspaceModule,
    FuelFlowToLoadTestModule,
    FuelFlowToLoadTestWorkspaceModule,
    AppECorrelationTestRunModule,
    AppECorrelationTestRunWorkspaceModule,
    AppECorrelationTestSummaryModule,
    AppECorrelationTestSummaryWorkspaceModule,
    AppEHeatInputFromGasModule,
    AppEHeatInputFromGasWorkspaceModule,
    AppEHeatInputFromOilModule,
    AppEHeatInputFromOilWorkspaceModule,
    FuelFlowToLoadBaselineWorkspaceModule,
    FuelFlowToLoadBaselineModule,
    CalibrationInjectionWorkspaceModule,
    CalibrationInjectionModule,
    OnlineOfflineCalibrationModule,
    OnlineOfflineCalibrationWorkspaceModule,
    MonitorLocationModule,
    ReportingPeriodModule,
    FuelFlowmeterAccuracyModule,
    FuelFlowmeterAccuracyWorkspaceModule,
    CycleTimeSummaryWorkspaceModule,
    CycleTimeSummaryModule,
    TransmitterTransducerAccuracyModule,
    TransmitterTransducerAccuracyWorkspaceModule,
    CycleTimeInjectionModule,
    CycleTimeInjectionWorkspaceModule,
    UnitDefaultTestWorkspaceModule,
    UnitDefaultTestModule,
    UnitDefaultTestRunWorkspaceModule,
    UnitDefaultTestRunModule,
    HgSummaryWorkspaceModule,
    HgInjectionModule,
    HgInjectionWorkspaceModule,
    HgSummaryModule,
    QaCertificationEventWorkspaceModule,
    MonitorSystemWorkspaceModule,
    TestExtensionExemptionsWorkspaceModule,
    TestExtensionExemptionsModule,
    QaCertificationEventModule,
    GasComponentCodeModule,
    ReferenceMethodCodeModule,
    GasTypeCodeModule,
    CrossCheckCatalogValueModule,
    WhatHasDataModule,
  ],
  providers: [DbLookupValidator, IsValidCodesValidator],
})
export class AppModule {}
