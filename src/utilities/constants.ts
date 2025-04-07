import { TestTypeCodes } from '../enums/test-type-code.enum';
import { Logger } from '@us-epa-camd/easey-common/logger';

/**
 * Utility function to settle all promises and collect errors
 * Similar to Promise.all but doesn't fail on first error
 * Instead collects all results (successful and failed)
 * @param promises Array of promises to settle
 * @param logger Optional logger to log errors
 * @returns Array of successful results
 */
export async function settlePromises<T>(
  promises: Promise<T>[],
  logger?: Logger
): Promise<T[]> {
  if (!promises || promises.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(promises);
  const successResults: T[] = [];
  const errors: Error[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successResults.push(result.value);
    } else {
      const error = result.reason;
      if (logger) {
        logger.error(`Error in promise at index ${index}: ${error.message}`);
      }
      errors.push(error);
    }
  });

  // If there were errors, log a summary
  if (errors.length > 0 && logger) {
    logger.error(`${errors.length} errors occurred while processing promises`);
  }

  return successResults;
}

export const MIN_HOUR = 0;
export const MAX_HOUR = 23;
export const MIN_MINUTE = 0;
export const MAX_MINUTE = 59;

export const MISC_TEST_TYPE_CODES = [
  TestTypeCodes.DAHS.toString(),
  TestTypeCodes.DGFMCAL.toString(),
  TestTypeCodes.MFMCAL.toString(),
  TestTypeCodes.TSCAL.toString(),
  TestTypeCodes.BCAL.toString(),
  TestTypeCodes.QGA.toString(),
  TestTypeCodes.LEAK.toString(),
  TestTypeCodes.OTHER.toString(),
  TestTypeCodes.PEI.toString(),
  TestTypeCodes.PEMSACC.toString(),
];

export const VALID_CODES_FOR_MON_SYS_ID_VALIDATION = [
  TestTypeCodes.RATA,
  TestTypeCodes.F2LREF,
  TestTypeCodes.F2LCHK,
  TestTypeCodes.APPE,
  TestTypeCodes.FF2LBAS,
  TestTypeCodes.FF2LTST,
  // TODO:  Needs to Add Misc Test Type Codes Where Monitoring System ID is required.
];

export const YEAR_QUARTER_TEST_TYPE_CODES = [
  TestTypeCodes.F2LCHK,
  TestTypeCodes.FF2LTST,
];

export const GRACE_PERIOD_IND_TEST_TYPE_CODES = [
  TestTypeCodes.LINE,
  TestTypeCodes.HGLINE,
  TestTypeCodes.HGSI3,
  TestTypeCodes.RATA,
  TestTypeCodes.LEAK,
];

export const BEGIN_DATE_TEST_TYPE_CODES = [
  TestTypeCodes.UNITDEF.toString(),
  TestTypeCodes.FF2LBAS.toString(),
  TestTypeCodes.APPE.toString(),
  TestTypeCodes.ONOFF.toString(),
  TestTypeCodes.RATA.toString(),
  TestTypeCodes.HGSI3.toString(),
  TestTypeCodes.HGLINE.toString(),
  TestTypeCodes.LINE.toString(),
  TestTypeCodes.CYCLE.toString(),
  TestTypeCodes.SEVENDAY.toString(),
];

// From TEST-3 in QA/Cert Data Check Specification
export const VALID_CODES_FOR_BEGIN_MINUTE_VALIDATION = [
  TestTypeCodes.UNITDEF.toString(),
  TestTypeCodes.APPE.toString(),
  TestTypeCodes.RATA.toString(),
  TestTypeCodes.HGSI3.toString(),
  TestTypeCodes.HGLINE.toString(),
  TestTypeCodes.LINE.toString(),
  TestTypeCodes.CYCLE.toString(),
  TestTypeCodes.SEVENDAY.toString(),
];

export const VALID_CODES_FOR_END_MINUTE_VALIDATION = [
  TestTypeCodes.SEVENDAY.toString(),
  TestTypeCodes.CYCLE.toString(),
  TestTypeCodes.LINE.toString(),
  TestTypeCodes.HGLINE.toString(),
  TestTypeCodes.HGSI3.toString(),
  TestTypeCodes.RATA.toString(),
  TestTypeCodes.F2LREF.toString(),
  TestTypeCodes.APPE.toString(),
  TestTypeCodes.FFACC.toString(),
  TestTypeCodes.FFACCTT.toString(),
  TestTypeCodes.UNITDEF.toString(),
  TestTypeCodes.DAHS.toString(),
  TestTypeCodes.DGFMCAL.toString(),
  TestTypeCodes.MFMCAL.toString(),
  TestTypeCodes.TSCAL.toString(),
  TestTypeCodes.BCAL.toString(),
  TestTypeCodes.QGA.toString(),
  TestTypeCodes.LEAK.toString(),
  TestTypeCodes.OTHER.toString(),
  TestTypeCodes.PEI.toString(),
  TestTypeCodes.PEMSACC.toString(),
];

export const BEGIN_END_MINUTE_REQUIRED_TYPES = [
  TestTypeCodes.LINE.toString(),
  TestTypeCodes.RATA.toString(),
  TestTypeCodes.CYCLE.toString(),
  TestTypeCodes.F2LREF.toString(),
  TestTypeCodes.APPE.toString(),
  TestTypeCodes.UNITDEF.toString(),
];

export const VALID_CODES_FOR_COMPONENT_ID_VALIDATION = [
  TestTypeCodes.FFACCTT,
  TestTypeCodes.FFACC,
  TestTypeCodes.ONOFF,
  TestTypeCodes.HGLINE,
  TestTypeCodes.HGSI3,
  TestTypeCodes.LINE,
  TestTypeCodes.CYCLE,
  TestTypeCodes.SEVENDAY,
  // TODO:  Needs to Add Misc Test Type Codes Where Component ID is required.
];

export const VALID_CODES_FOR_TEST_REASON_CODE_VALIDATION = [
  TestTypeCodes.UNITDEF,
  TestTypeCodes.FF2LTST,
  TestTypeCodes.FFACCTT,
  TestTypeCodes.FFACC,
  TestTypeCodes.APPE,
  TestTypeCodes.ONOFF,
  TestTypeCodes.F2LCHK,
  TestTypeCodes.RATA,
  TestTypeCodes.HGSI3,
  TestTypeCodes.HGLINE,
  TestTypeCodes.LINE,
  TestTypeCodes.CYCLE,
  TestTypeCodes.SEVENDAY,
  ...MISC_TEST_TYPE_CODES,
];

export const VALID_CODES_FOR_SPAN_SCALE_CODE_VALIDATION = [
  TestTypeCodes.SEVENDAY.toString(),
  TestTypeCodes.CYCLE.toString(),
  TestTypeCodes.LINE.toString(),
  TestTypeCodes.HGLINE.toString(),
  TestTypeCodes.HGSI3.toString(),
  TestTypeCodes.ONOFF.toString(),
];

export const VALID_CODES_FOR_END_DATE_VALIDATION = [
  TestTypeCodes.SEVENDAY,
  TestTypeCodes.CYCLE,
  TestTypeCodes.LINE,
  TestTypeCodes.HGLINE,
  TestTypeCodes.HGSI3,
  TestTypeCodes.RATA,
  TestTypeCodes.F2LREF,
  TestTypeCodes.ONOFF,
  TestTypeCodes.APPE,
  TestTypeCodes.FFACC,
  TestTypeCodes.FFACCTT,
  TestTypeCodes.FF2LBAS,
  TestTypeCodes.UNITDEF,
  TestTypeCodes.DAHS,
  TestTypeCodes.DGFMCAL,
  TestTypeCodes.MFMCAL,
  TestTypeCodes.TSCAL,
  TestTypeCodes.BCAL,
  TestTypeCodes.QGA,
  TestTypeCodes.LEAK,
  TestTypeCodes.OTHER,
  TestTypeCodes.PEI,
  TestTypeCodes.PEMSACC,
];

export const VALID_TEST_TYPE_CODES_FOR_TEST_RESULT_CODE = [
  TestTypeCodes.SEVENDAY.toString(),
  TestTypeCodes.CYCLE.toString(),
  TestTypeCodes.LINE.toString(),
  TestTypeCodes.HGLINE.toString(),
  TestTypeCodes.HGSI3.toString(),
  TestTypeCodes.RATA.toString(),
  TestTypeCodes.F2LCHK.toString(),
  TestTypeCodes.ONOFF.toString(),
  TestTypeCodes.FFACC.toString(),
  TestTypeCodes.FFACCTT.toString(),
  TestTypeCodes.FF2LTST.toString(),
  TestTypeCodes.DAHS.toString(),
  TestTypeCodes.DGFMCAL.toString(),
  TestTypeCodes.MFMCAL.toString(),
  TestTypeCodes.TSCAL.toString(),
  TestTypeCodes.BCAL.toString(),
  TestTypeCodes.QGA.toString(),
  TestTypeCodes.LEAK.toString(),
  TestTypeCodes.OTHER.toString(),
  TestTypeCodes.PEI.toString(),
  TestTypeCodes.PEMSACC.toString(),
];
