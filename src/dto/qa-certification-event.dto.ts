import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { ValidationArguments } from 'class-validator';

const KEY = 'QA Certification Event';
const DATE_FORMAT = 'YYYY-MM-DD';
export class QACertificationEventBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  monitoringSystemID?: string;
  componentID?: string;
  qaCertEventCode: string;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT} for [${KEY}].`;
    },
  })
  qaCertEventDate: Date;
  qaCertEventHour?: number;
  requiredTestCode?: string;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT} for [${KEY}].`;
    },
  })
  conditionalBeginDate?: Date;
  conditionalBeginHour?: number;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT} for [${KEY}].`;
    },
  })
  completionTestDate?: Date;
  completionTestHour?: number;
}

export class QACertificationEventRecordDTO extends QACertificationEventBaseDTO {
  id: string;
  locationId: string;
  lastUpdated: Date;
  updatedStatusFlag: string;
  needsEvalFlag: string;
  checkSessionId: string;
  submissionId: number;
  submissionAvailabilityCode: string;
  pendingStatusCode: string;
  evalStatusCode: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class QACertificationEventImportDTO extends QACertificationEventBaseDTO {}

export class QACertificationEventDTO extends QACertificationEventRecordDTO {}
