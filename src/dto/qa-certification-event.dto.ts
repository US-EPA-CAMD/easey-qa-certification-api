import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';

const KEY = 'QA Certification Event';
const DATE_FORMAT = 'YYYY-MM-DD';
export class QACertificationEventBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;
  @IsOptional()
  @IsString()
  unitId?: string;
  @IsOptional()
  @IsString()
  monitoringSystemID?: string;
  @IsOptional()
  @IsString()
  componentID?: string;
  @IsString()
  qaCertEventCode: string;

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
  qaCertEventDate: Date;
  @IsNumber()
  qaCertEventHour?: number;
  @IsString()
  requiredTestCode?: string;

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
  conditionalBeginDate?: Date;
  @IsNumber()
  conditionalBeginHour?: number;

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
  completionTestDate?: Date;
  @IsNumber()
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
