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
import { RataRunWorkspaceModule } from './rata-run-workspace/rata-run.module';

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
            path: ':testSumId/rata',
            module: RataModule,
            children: [
              {
                path: ':rataId/rata-summary',
                module: RataSummaryModule,
                children: [
                  {
                    path: ':rataSumId/rata-run',
                    module: RataRunModule,
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
            path: ':testSumId/rata',
            module: RataWorkspaceModule,
            children: [
              {
                path: ':rataId/rata-summary',
                module: RataSummaryWorkspaceModule,
                children: [
                  {
                    path: ':rataSumId/rata-run',
                    module: RataRunWorkspaceModule,
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
