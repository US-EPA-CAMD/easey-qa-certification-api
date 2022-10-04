import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { dbConfig } from '@us-epa-camd/easey-common/config';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CorsOptionsModule } from '@us-epa-camd/easey-common/cors-options';

import routes from './routes';
import appConfig from './config/app.config';
import { TypeOrmConfigService } from './config/typeorm.config';

import { QACertificationModule } from './qa-certification/qa-certification.module';
import { QACertificationWorkspaceModule } from './qa-certification-workspace/qa-certification.module';

import { LocationModule } from './location/location.module';
import { LocationWorkspaceModule } from './location-workspace/location.module';
import { ComponentModule } from './component-workspace/component.module';
import { AnalyzerRangeModule } from './analyzer-range-workspace/analyzer-range.module';
import { RataModule } from './rata/rata.module';
import { RataWorkspaceModule } from './rata-workspace/rata-workspace.module';
import { MonitorSystemModule } from './monitor-system/monitor-system.module';
import { MonitorMethodModule } from './monitor-method/monitor-method.module';
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
import { AppEHeatInputOilModule } from './app-e-heat-input-oil/app-e-heat-input-oil.module';
import { AppEHeatInputOilWorkspaceModule} from './app-e-heat-input-oil-workspace/app-e-heat-input-oil.module';

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
    HttpModule,
    LoggerModule,
    CorsOptionsModule,
    QACertificationModule,
    QACertificationWorkspaceModule,
    LocationModule,
    LocationWorkspaceModule,
    ComponentModule,
    AnalyzerRangeModule,
    RataModule,
    RataWorkspaceModule,
    MonitorSystemModule,
    MonitorMethodModule,
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
    FuelFlowToLoadTestModule,
    FuelFlowToLoadTestWorkspaceModule,
    AppECorrelationTestRunModule,
    AppECorrelationTestRunWorkspaceModule,
    AppEHeatInputFromGasModule,
    AppEHeatInputFromGasWorkspaceModule,
    AppEHeatInputOilModule,
    AppEHeatInputOilWorkspaceModule,
  ],
})
export class AppModule {}
