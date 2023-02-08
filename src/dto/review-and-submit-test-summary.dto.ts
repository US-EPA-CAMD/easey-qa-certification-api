import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { ValidationArguments } from 'class-validator';

const DATE_FORMAT = 'YYYY-MM-DD';

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
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT}.`;
    },
  })
  beginDate: string;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT}.`;
    },
  })
  endDate: string;

  userId: string;

  updateDate: string;

  evalStatusCode: string;

  submissionCode: string;

  periodAbbreviation: string;
}
