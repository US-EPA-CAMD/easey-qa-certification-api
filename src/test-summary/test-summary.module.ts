import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirEmissionTestingModule } from '../air-emission-testing/air-emission-testing.module';
import { AppECorrelationTestSummaryModule } from '../app-e-correlation-test-summary/app-e-correlation-test-summary.module';
import { CalibrationInjectionModule } from '../calibration-injection/calibration-injection.module';
import { CycleTimeSummaryModule } from '../cycle-time-summary/cycle-time-summary.module';
import { FlowToLoadCheckModule } from '../flow-to-load-check/flow-to-load-check.module';
import { FlowToLoadReferenceModule } from '../flow-to-load-reference/flow-to-load-reference.module';
import { FuelFlowToLoadBaselineModule } from '../fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.module';
import { FuelFlowToLoadTestModule } from '../fuel-flow-to-load-test/fuel-flow-to-load-test.module';
import { FuelFlowmeterAccuracyModule } from '../fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.module';
import { HgInjectionModule } from '../hg-injection/hg-injection.module';
import { HgSummaryModule } from '../hg-summary/hg-summary.module';
import { LinearityInjectionModule } from '../linearity-injection/linearity-injection.module';
import { LinearitySummaryModule } from '../linearity-summary/linearity-summary.module';
import { TestSummaryMap } from '../maps/test-summary.map';
import { OnlineOfflineCalibrationModule } from '../online-offline-calibration/online-offline-calibration.module';
import { ProtocolGasModule } from '../protocol-gas/protocol-gas.module';
import { RataModule } from '../rata/rata.module';
import { TestQualificationModule } from '../test-qualification/test-qualification.module';
import { TransmitterTransducerAccuracyModule } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.module';
import { UnitDefaultTestModule } from '../unit-default-test/unit-default-test.module';
import { TestSummaryController } from './test-summary.controller';
import { TestSummaryRepository } from './test-summary.repository';
import { TestSummaryService } from './test-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestSummaryRepository]),

    LinearitySummaryModule,
    LinearityInjectionModule,
    ProtocolGasModule,
    RataModule,
    TestQualificationModule,
    FuelFlowToLoadTestModule,
    FuelFlowToLoadBaselineModule,
    FuelFlowmeterAccuracyModule,
    FlowToLoadCheckModule,
    FlowToLoadReferenceModule,
    AirEmissionTestingModule,
    AppECorrelationTestSummaryModule,
    CalibrationInjectionModule,
    OnlineOfflineCalibrationModule,
    CycleTimeSummaryModule,
    UnitDefaultTestModule,
    TransmitterTransducerAccuracyModule,
    HgSummaryModule,
    HgInjectionModule,
  ],
  controllers: [TestSummaryController],
  providers: [TestSummaryMap, TestSummaryRepository, TestSummaryService],
  exports: [TypeOrmModule, TestSummaryMap, TestSummaryService],
})
export class TestSummaryModule {}
