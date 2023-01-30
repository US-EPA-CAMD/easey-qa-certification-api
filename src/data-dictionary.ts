import { v4 as uuid } from 'uuid';

export const getMetadata = (property: any, metadataKey: string) => {
  if (property.fieldLabels.value === 'id') {
    return {
      description: `Primary unique identifier of a ${metadataKey} record. `,
      example: uuid(),
    };
  }

  let metadata = property.metadata[metadataKey];

  if (!metadata) {
    return property.metadata.default;
  }

  return metadata;
};

export enum MetadataKeys {
  APP_E_COR_TST_SUM = 'appECorrelationTestSummary',
  APP_E_COR_TST_RUN = 'appECorrelationTestRun',
  CYCLE_TIME_INJECTION = 'cycleTimeInjection',
  DEFAULT = 'default',
  FLOW_TO_LOAD_REF = 'flowToLoadReference',
  LINEARITY_SUMMARY = 'linearitySummary',
  RATA_SUMMARY = 'rataSummary',
  RATA_RUN = 'rataRun',
  TEST_SUMMARY = 'testSummary',
  TEST_EXTENSION_EXEMPTION = 'qaTestExtensionExemptionId',
}

export const dataDictionary = {
  id: {
    fieldLabels: {
      label: null,
      value: 'id',
    },
    metadata: {
      default: {
        description: 'Primary unique identifier of the record.',
        example: '',
      },
    },
  },
  addDate: {
    fieldLabels: {
      label: null,
      value: 'addDate',
    },
    metadata: {
      default: {
        description: '',
        example: '',
      },
    },
  },
  accuracyTestMethodCode: {
    fieldLabels: {
      label: 'Accuracy Test Method Code',
      value: 'accuracyTestMethodCode',
    },
    metadata: {
      default: {
        description:
          'Code used to indicate fuel flowmeter accuracy test method.',
        example: 'LCRM',
      },
    },
  },
  accuracyTestNumber: {
    fieldLabels: {
      label: 'Accuracy Test Number',
      value: 'accuracyTestNumber',
    },
    metadata: {
      default: {
        description: 'Test number of most recent fuel flowmeter accuracy test.',
        example: 'GM112017081913',
      },
    },
  },
  aeCorrTestRunId: {
    fieldLabels: {
      label: null,
      value: 'aeCorrTestRunId',
    },
    metadata: {
      default: {
        description:
          'Unique combination of DB_Token and identity key generated by sequence generator.',
        example: 'APPECORRTSTRUN1',
      },
    },
  },
  aeCorrTestSumId: {
    fieldLabels: {
      label: null,
      value: 'aeCorrTestSumId',
    },
    metadata: {
      default: {
        description:
          'Unique combination of DB_Token and identity key generated by sequence generator.',
        example: 'APPECORRTSTSUM123',
      },
    },
  },
  aetbEmail: {
    fieldLabels: {
      label: 'AETB Email',
      value: 'aetbEmail',
    },
    metadata: {
      default: {
        description: 'Email address for Air Emission Testing Body.',
        example: 'jdoe@xyzsolutions.com',
      },
    },
  },
  aetbName: {
    fieldLabels: {
      label: 'AETB Name',
      value: 'aetbName',
    },
    metadata: {
      default: {
        description: 'Name of Air Emission Testing Body.',
        example: 'XYZ Solutions, Inc',
      },
    },
  },
  aetbPhoneNumber: {
    fieldLabels: {
      label: 'AETB Phone Number',
      value: 'aetbPhoneNumber',
    },
    metadata: {
      default: {
        description: 'Phone number for the Air Emission Testing Body.',
        example: '123-456-0789',
      },
    },
  },
  apsCode: {
    fieldLabels: {
      label: 'APS Code',
      value: 'apsCode',
    },
    metadata: {
      default: {
        description: 'Code used to identify the Alternate Performance Spec.',
        example: 'PS15',
      },
    },
  },
  apsIndicator: {
    fieldLabels: {
      label: 'APS Indicator',
      value: 'apsIndicator',
    },
    metadata: {
      default: {
        description:
          'Used to indicate if the alternative performance specification (APS) is used.',
        example: 0,
      },
    },
  },
  averageDifference: {
    fieldLabels: {
      label: 'Average Difference',
      value: 'averageDifference',
    },
    metadata: {
      default: {
        description:
          'Quarterly average absolute percent difference between baseline ratio and hourly quarterly ratios.',
        example: 0.6,
      },
    },
  },
  averageFuelFlowRate: {
    fieldLabels: {
      label: 'Average Fuel Flow Rate',
      value: 'averageFuelFlowRate',
    },
    metadata: {
      default: {
        description:
          'Average fuel flow rate (100 scfh for gas and lb/hr for oil).',
        example: 4085,
      },
    },
  },
  averageGrossUnitLoad: {
    fieldLabels: {
      label: 'Average Gross Unit Load',
      value: 'averageGrossUnitLoad',
    },
    metadata: {
      default: {
        description: 'Average gross unit load (MWe or Steam).',
        example: 277,
      },
      rataSummary: {
        description:
          'Average gross unit load (MWe or steam) or average velocity at operating level.',
        example: 71,
      },
    },
  },
  averageHourlyHeatInputRate: {
    fieldLabels: {
      label: 'Average Hourly Heat Input Rate',
      value: 'averageHourlyHeatInputRate',
    },
    metadata: {
      default: {
        description: 'Average hourly heat input rate.',
        example: 1200,
      },
      flowToLoadReference: {
        description: 'Average hourly heat input rate during RATA.',
        example: 2000,
      },
      appECorrelationTestSummary: {
        description: 'Average hourly heat input rate at this level.',
        example: 1249,
      },
    },
  },
  averageLoad: {
    fieldLabels: {
      label: 'Average Load',
      value: 'averageLoad',
    },
    metadata: {
      default: {
        description: 'Average load (MWe or 1000 lbs steam per hour).',
        example: 39,
      },
    },
  },
  averageReferenceMethodFlow: {
    fieldLabels: {
      label: 'Average Reference Method Flow',
      value: 'averageReferenceMethodFlow',
    },
    metadata: {
      default: {
        description:
          'Average reference method flow rate during reference flow RATA.',
        example: 125122000,
      },
    },
  },
  averageStackFlowRate: {
    fieldLabels: {
      label: 'Average Stack Flow Rate',
      value: 'averageStackFlowRate',
    },
    metadata: {
      default: {
        description:
          'Average stack flow rate, wet basis, adjusted if applicable for wall effects.',
        example: 90122000,
      },
    },
  },
  averageVelocityWithoutWallEffects: {
    fieldLabels: {
      label: 'Average Velocity without Wall Effects',
      value: 'averageVelocityWithoutWallEffects',
    },
    metadata: {
      default: {
        description:
          'Average velocity for run, not accounting for wall effects.',
        example: 43.42,
      },
    },
  },
  averageVelocityWithWallEffects: {
    fieldLabels: {
      label: 'Average Velocity with Wall Effects',
      value: 'averageVelocityWithWallEffects',
    },
    metadata: {
      default: {
        description: 'Average velocity for run, accounting for wall effects.',
        example: null,
      },
    },
  },
  avgAbsolutePercentDiff: {
    fieldLabels: {
      label: 'Average Absolute Percent Difference',
      value: 'avgAbsolutePercentDiff',
    },
    metadata: {
      default: {
        description:
          'Average absolute percent difference between reference ratio (GHR) and hourly ratios (or GHR values).',
        example: 2.7,
      },
    },
  },
  avgSquareVelDiffPressure: {
    fieldLabels: {
      label: 'Avg Square Vel Diff Pressure',
      value: 'avgSquareVelDiffPressure',
    },
    metadata: {
      default: {
        description:
          'Average of square roots of velocity differential pressures at traverse point.',
        example: null,
      },
    },
  },
  avgVelDiffPressure: {
    fieldLabels: {
      label: 'Avg Vel Diff Pressure',
      value: 'avgVelDiffPressure',
    },
    metadata: {
      default: {
        description:
          'Average velocity differential pressure at traverse point.',
        example: 0.23,
      },
    },
  },
  barometricPressure: {
    fieldLabels: {
      label: 'Barometric Pressure',
      value: 'barometricPressure',
    },
    metadata: {
      default: {
        description: 'P-bar, barometric pressure, in Hg.',
        example: 23.35,
      },
    },
  },
  baselineFuelFlowToLoadRatio: {
    fieldLabels: {
      label: 'Baseline Fuel Flow-to-Load Ratio',
      value: 'baselineFuelFlowToLoadRatio',
    },
    metadata: {
      default: {
        description: 'Baseline fuel flow to load ratio.',
        example: 105.97,
      },
    },
  },
  baselineGHR: {
    fieldLabels: {
      label: 'Baseline Gross Heat Rate',
      value: 'baselineGHR',
    },
    metadata: {
      default: {
        description: 'Baseline gross heat rate (GHR).',
        example: 12238,
      },
    },
  },
  beginDate: {
    fieldLabels: {
      label: 'Begin Date',
      value: 'beginDate',
    },
    metadata: {
      default: {
        description:
          'Date in which information became effective or activity started.',
        example: '2020-07-25',
      },
      cycleTimeInjection: {
        description: 'Date of the cycle time injection.',
        example: '2020-01-27',
      },
      appECorrelationTestRun: {
        description: 'Date on which the run started.',
        example: '2020-07-01',
      },
    },
  },
  beginHour: {
    fieldLabels: {
      label: 'Begin Hour',
      value: 'beginHour',
    },
    metadata: {
      default: {
        description:
          'Hour in which information became effective or activity started.',
        example: 12,
      },
      appECorrelationTestRun: {
        description: 'Hour in which the run started.',
        example: 6,
      },
    },
  },
  beginMinute: {
    fieldLabels: {
      label: 'Begin Minute',
      value: 'beginMinute',
    },
    metadata: {
      default: {
        description:
          'Minute in which information became effective or activity started.',
        example: 8,
      },
      testSummary: {
        description: 'Minute in which the test began.',
        example: 50,
      },
      cycleTimeInjection: {
        description: 'Minute in which the cycle time injection began.',
        example: 16,
      },
      rataRun: {
        description: 'Minute in which the RATA run began.',
        example: 10,
      },
      appECorrelationTestRun: {
        description: 'Minute in which the run started.',
        example: 5,
      },
    },
  },

  qaTestExtensionExemptionId: {
    fieldLabels: {
      label: 'qaTestExtensionExemptionId',
      value: 'qaTestExtensionExemptionId',
    },
    metadata: {
      default: {
        description:
          'Unique Id for variances from prescribed testing requirements or extensions to the normal QA testing schedule.',
        example: '077065AJFR-3DE60EF3296844F2B5173ADEAA22B02E',
      },
    },
  },
};
