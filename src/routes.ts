import { Routes } from 'nest-router';

import { QACertificationModule } from './qa-certification/qa-certification.module';
import { QACertificationWorkspaceModule } from './qa-certification-workspace/qa-certification.module';
import { LocationModule } from './location/location.module';
import { LocationWorkspaceModule } from './location-workspace/location.module';
import { TestSummaryModule } from './test-summary/test-summary.module';
import { TestSummaryWorkspaceModule } from './test-summary-workspace/test-summary.module';
import { LinearitySummaryModule } from './linearity-summary/linearity-summary.module';
import { LinearitySummaryWorkspaceModule } from './linearity-summary-workspace/linearity-summary.module';
import { LinearityInjectionModule } from './linearity-injection/linearity-injection.module';
import { LinearityInjectionWorkspaceModule } from './linearity-injection-workspace/linearity-injection.module';
import { ProtocolGasModule } from './protocol-gas/protocol-gas.module';
import { ProtocolGasWorkspaceModule } from './protocol-gas-workspace/protocol-gas.module';
import { RataWorkspaceModule } from './rata-workspace/rata-workspace.module';
import { RataModule } from './rata/rata.module';
import { RataSummaryWorkspaceModule } from './rata-summary-workspace/rata-summary-workspace.module';
import { RataSummaryModule } from './rata-summary/rata-summary.module';
import { RataRunModule } from './rata-run/rata-run.module';
import { RataRunWorkspaceModule } from './rata-run-workspace/rata-run-workspace.module';
import { TestQualificationModule } from './test-qualification/test-qualification.module';
import { TestQualificationWorkspaceModule } from './test-qualification-workspace/test-qualification-workspace.module';
import { AirEmissionTestingWorkspaceModule } from './air-emission-testing-workspace/air-emission-testing-workspace.module';
import { AirEmissionTestingModule } from './air-emission-testing/air-emission-testing.module';
import { FlowRataRunModule } from './flow-rata-run/flow-rata-run.module';
import { FlowRataRunWorkspaceModule } from './flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataTraverseWorkspaceModule } from './rata-traverse-workspace/rata-traverse-workspace.module';
import { RataTraverseModule } from './rata-traverse/rata-traverse.module';
import { AppECorrelationTestSummaryModule } from './app-e-correlation-test-summary/app-e-correlation-test-summary.module';
import { AppECorrelationTestSummaryWorkspaceModule } from './app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';
import { FuelFlowToLoadTestModule } from './fuel-flow-to-load-test/fuel-flow-to-load-test.module';
import { FuelFlowToLoadTestWorkspaceModule } from './fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.module';
import { AppECorrelationTestRunWorkspaceModule } from './app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.module';
import { AppECorrelationTestRunModule } from './app-e-correlation-test-run/app-e-correlation-test-run.module';
import { AppEHeatInputFromGasModule } from './app-e-heat-input-from-gas/app-e-heat-input-from-gas.module';
import { AppEHeatInputFromGasWorkspaceModule } from './app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.module';
import { AppEHeatInputFromOilModule } from './app-e-heat-input-from-oil/app-e-heat-input-from-oil.module';
import { AppEHeatInputFromOilWorkspaceModule } from './app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.module';
import { FlowToLoadCheckWorkspaceModule } from './flow-to-load-check-workspace/flow-to-load-check-workspace.module';
import { FlowToLoadCheckModule } from './flow-to-load-check/flow-to-load-check.module';
import { FlowToLoadReferenceWorkspaceModule } from './flow-to-load-reference-workspace/flow-to-load-reference-workspace.module';
import { FlowToLoadReferenceModule } from './flow-to-load-reference/flow-to-load-reference.module';
import { FuelFlowToLoadBaselineWorkspaceModule } from './fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.module';
import { FuelFlowToLoadBaselineModule } from './fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.module';

const routes: Routes = [
  {
    path: '/',
    module: QACertificationModule,
  },
  {
    path: '/workspace',
    module: QACertificationWorkspaceModule,
  },
  {
    path: '/locations',
    module: LocationModule,
    children: [
      {
        path: ':locId/test-summary',
        module: TestSummaryModule,
        children: [
          {
            path: ':testSumId/linearities',
            module: LinearitySummaryModule,
            children: [
              {
                path: ':linSumId/injections',
                module: LinearityInjectionModule,
              },
            ],
          },
          {
            path: ':testSumId/protocol-gases',
            module: ProtocolGasModule,
          },
          {
            path: ':testSumId/test-qualifications',
            module: TestQualificationModule,
          },
          {
            path: ':testSumId/flow-to-load-checks',
            module: FlowToLoadCheckModule,
          },
          {
            path: ':testSumId/flow-to-load-references',
            module: FlowToLoadReferenceModule,
          },
          {
            path: ':testSumId/fuel-flow-to-load-tests',
            module: FuelFlowToLoadTestModule,
          },
          {
            path: ':testSumId/fuel-flow-to-load-baselines',
            module: FuelFlowToLoadBaselineModule,
          },
          {
            path: ':testSumId/air-emission-testings',
            module: AirEmissionTestingModule,
          },
          {
            path: ':testSumId/appendix-e-correlation-test-summaries',
            module: AppECorrelationTestSummaryModule,
            children: [
              {
                path: ':appECorrTestSumId/appendix-e-correlation-test-runs',
                module: AppECorrelationTestRunModule,
                children: [
                  {
                    path: ':appECorrTestRunId/appendix-e-heat-input-from-gases',
                    module: AppEHeatInputFromGasModule,
                  },
                  {
                    path: ':appECorrTestRunId/appendix-e-heat-input-from-oils',
                    module: AppEHeatInputFromOilModule,
                  },
                ],
              },
            ],
          },
          {
            path: ':testSumId/rata',
            module: RataModule,
            children: [
              {
                path: ':rataId/rata-summaries',
                module: RataSummaryModule,
                children: [
                  {
                    path: ':rataSumId/rata-runs',
                    module: RataRunModule,
                    children: [
                      {
                        path: ':rataRunId/flow-rata-runs',
                        module: FlowRataRunModule,
                        children: [
                          {
                            path: ':flowRataRunId/rata-traverses',
                            module: RataTraverseModule,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'workspace/locations',
    module: LocationWorkspaceModule,
    children: [
      {
        path: ':locId/test-summary',
        module: TestSummaryWorkspaceModule,
        children: [
          {
            path: ':testSumId/linearities',
            module: LinearitySummaryWorkspaceModule,
            children: [
              {
                path: ':linSumId/injections',
                module: LinearityInjectionWorkspaceModule,
              },
            ],
          },
          {
            path: ':testSumId/protocol-gases',
            module: ProtocolGasWorkspaceModule,
          },
          {
            path: ':testSumId/air-emission-testings',
            module: AirEmissionTestingWorkspaceModule,
          },
          {
            path: ':testSumId/test-qualifications',
            module: TestQualificationWorkspaceModule,
          },
          {
            path: ':testSumId/appendix-e-correlation-test-summaries',
            module: AppECorrelationTestSummaryWorkspaceModule,
            children: [
              {
                path: ':appECorrTestSumId/appendix-e-correlation-test-runs',
                module: AppECorrelationTestRunWorkspaceModule,
                children: [
                  {
                    path: ':appECorrTestRunId/appendix-e-heat-input-from-gases',
                    module: AppEHeatInputFromGasWorkspaceModule,
                  },
                  {
                    path: ':appECorrTestRunId/appendix-e-heat-input-from-oils',
                    module: AppEHeatInputFromOilWorkspaceModule,
                  },
                ],
              },
            ],
          },
          {
            path: ':testSumId/flow-to-load-checks',
            module: FlowToLoadCheckWorkspaceModule,
          },
          {
            path: ':testSumId/flow-to-load-references',
            module: FlowToLoadReferenceWorkspaceModule,
          },
          {
            path: ':testSumId/fuel-flow-to-load-tests',
            module: FuelFlowToLoadTestWorkspaceModule,
          },
          {
            path: ':testSumId/fuel-flow-to-load-baselines',
            module: FuelFlowToLoadBaselineWorkspaceModule,
          },
          {
            path: ':testSumId/rata',
            module: RataWorkspaceModule,
            children: [
              {
                path: ':rataId/rata-summaries',
                module: RataSummaryWorkspaceModule,
                children: [
                  {
                    path: ':rataSumId/rata-runs',
                    module: RataRunWorkspaceModule,
                    children: [
                      {
                        path: ':rataRunId/flow-rata-runs',
                        module: FlowRataRunWorkspaceModule,
                        children: [
                          {
                            path: ':flowRataRunId/rata-traverses',
                            module: RataTraverseWorkspaceModule,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
