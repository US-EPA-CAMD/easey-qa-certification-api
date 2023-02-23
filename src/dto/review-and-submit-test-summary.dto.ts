import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { ValidationArguments } from 'class-validator';

const DATE_FORMAT = 'YYYY-MM-DD';
const KEY = 'Review And Submit Test Summary';

export class ReviewAndSubmitTestSummaryDTO {
  orisCode: number;

  facilityName: string;

  monPlanId: string;

  locationInfo: string;

  testSumId: string;

  systemComponentId: string;

  testTypeCode: string;

  testNum: string;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  beginDate: string;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  endDate: string;

  userId: string;

  updateDate: string;

  evalStatusCode: string;

  submissionCode: string;

  periodAbbreviation: string;
}
