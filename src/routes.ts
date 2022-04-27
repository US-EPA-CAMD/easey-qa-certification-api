import { Routes } from 'nest-router';

import { EventModule } from './event/event.module';

const routes: Routes = [
  {
    path: '/locations/{locId}/systems/{sysId}/components/{compId}/events',
    module: EventModule,
    // children: [
    //   {
    //     path: ':eventId/supplemental-data',
    //     module: EventSupplementalDataModule
    //   }
    // ]
  },
  // {
  //   path: '/locations/{locId}/systems/{sysId}/components/{compId}/supplemental-data',
  //   module: SupplementalDataModule,
  //   children: [
  //     {
  //       path: ':suppId/attributes',
  //       module: SupplementalDataAttributesModule
  //     }
  //   ]
  // },
  // {
  //   path: '/locations/{locId}/systems/{sysId}/components/{compId}/test-extension-exemption',
  //   module: TestExtensionExemptionModule,
  // },
  // {
  //   path: '/locations/{locId}/systems/{sysId}/components/{compId}/test-summary',
  //   module: TestSummaryModule,
  //   children: [
  //     {
  //       path: ':testSumId/ae-correlations',
  //       module: AECorrelationModule,
  //     },
  //     {
  //       path: ':testSumId/calibration-injections',
  //       module: CalibrationInjectionModule,
  //     },
  //     {
  //       path: ':testSumId/cycle-time',
  //       module: CycleTimeModule,
  //       children: [
  //         {
  //           path: ':cycleTimeId/injections',
  //           module: CycleTimeInjectionModule
  //         }
  //       ]
  //     },
  //     {
  //       path: ':testSumId/flow-load-checks',
  //       module: FlowLoadCheckModule,
  //     },
  //     {
  //       path: ':testSumId/flow-load-refs',
  //       module: FlowLoadRefModule,
  //     },
  //     {
  //       path: ':testSumId/fuel-flow-load-baselines',
  //       module: FuelFlowLoadBaselineModule,
  //     },
  //     {
  //       path: ':testSumId/fuel-flow-load-checks',
  //       module: FuelFlowLoadCheckModule,
  //     },
  //     {
  //       path: ':testSumId/fuel-flow-meter-accuracy',
  //       module: FuelFlowMeterAccuracyModule,
  //     },
  //     {
  //       path: ':testSumId/hg-test',
  //       module: HGTestSummaryModule,
  //       children: [
  //         {
  //           path: ':hgId/injections',
  //           module: HGTestInjectionModule
  //         }
  //       ]
  //     },
  //     {
  //       path: ':testSumId/linearity',
  //       module: LinearitySummaryModule,
  //       children: [
  //         {
  //           path: ':linSumId/injections',
  //           module: LinearityInjectionModule
  //         }
  //       ]
  //     }
  //   ]
  // },
];

export default routes;
