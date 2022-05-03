import { Routes } from 'nest-router';

import { EventModule } from './event/event.module';

const routes: Routes = [
  {
    path: '/events',
    module: EventModule,
    // children: [
    //   {
    //     path: '/supplemental-data',
    //     module: EventSupplementalDataModule
    //   }
    // ]
  },
  // {
  //   path: '/supplemental-data',
  //   module: SupplementalDataModule,
  //   children: [
  //     {
  //       path: '/attributes',
  //       module: SupplementalDataAttributesModule
  //     }
  //   ]
  // },
  // {
  //   path: '/test-ext-exemptions',
  //   module: TestExtensionExemptionModule,
  // },
  // {
  //   path: '/test-summary',
  //   module: TestSummaryModule,
  //   children: [
  //     {
  //       path: '/app-e-correlations',
  //       module: AppECorrelationTestModule,
  //       children: [
  //         {
  //           path: '/runs',
  //           module: AppECorrelationTestRunModule,
  //           children: [
  //             {
  //               path: '/gases',
  //               module: AppEHiGasModule
  //             },
  //             {
  //               path: '/oils',
  //               module: AppEHiOilModule
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       path: '/calibration-injections',
  //       module: CalibrationInjectionModule,
  //     },
  //     {
  //       path: '/cycle-times',
  //       module: CycleTimeModule,
  //       children: [
  //         {
  //           path: '/injections',
  //           module: CycleTimeInjectionModule
  //         }
  //       ]
  //     },
  //     {
  //       path: '/flow-2-load-checks',
  //       module: Flow2LoadCheckModule,
  //     },
  //     {
  //       path: '/flow-2-load-refs',
  //       module: Flow2LoadRefModule,
  //     },
  //     {
  //       path: '/fuel-flow-2-load-baselines',
  //       module: FuelFlow2LoadBaselineModule,
  //     },
  //     {
  //       path: '/fuel-flow-2-load-checks',
  //       module: FuelFlow2LoadCheckModule,
  //     },
  //     {
  //       path: '/fuel-flow-meter-accuracies',
  //       module: FuelFlowMeterAccuracyModule,
  //     },
  //     {
  //       path: '/hg-tests',
  //       module: HGTestSummaryModule,
  //       children: [
  //         {
  //           path: '/injections',
  //           module: HGTestInjectionModule
  //         }
  //       ]
  //     },
  //     {
  //       path: '/linearities',
  //       module: LinearitySummaryModule,
  //       children: [
  //         {
  //           path: '/injections',
  //           module: LinearityInjectionModule
  //         }
  //       ]
  //     },
  //     {
  //       path: '/on-off-cals',
  //       module: OnOffCalModule,
  //     },
  //     {
  //       path: '/qualifications',
  //       module: TestQualificationModule,
  //     },
  //     {
  //       path: '/unit-defaults',
  //       module: UnitDefaultTestModule,
  //       children: [
  //         {
  //           path: '/runs',
  //           module: UnitDefaultTestRunModule
  //         }
  //       ]
  //     },
  //     {
  //       path: '/trans-accuracies',
  //       module: TransAccuracyModule,
  //     },
  //     {
  //       path: '/ratas',
  //       module: RataModule,
  //       children: [
  //         {
  //           path: '/summaries',
  //           module: RataSummaryModule,
  //           children: [
  //             {
  //               path: '/runs',
  //               module: RataRunModule,
  //               children: [
  //                 {
  //                   path: '/flow-runs',
  //                   module: FlowRataRunModule,
  //                   children: [
  //                     {
  //                       path: '/traverses',
  //                       module: RataTraverseModule
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //   ]
  // },
];

export default routes;
