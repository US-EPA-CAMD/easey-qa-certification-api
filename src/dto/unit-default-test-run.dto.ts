import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, ValidationArguments } from 'class-validator';

const DATE_FORMAT = 'YYYY-MM-DD';
const KEY = 'Unit Default Test Run';
export class UnitDefaultTestRunBaseDTO {
  @IsNumber()
  operatingLevelForRun: number;
  @IsNumber()
  runNumber: number;

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
  beginDate: Date;
  @IsNumber()
  beginHour: number;
  @IsNumber()
  beginMinute: number;

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
  endDate: Date;
  @IsNumber()
  endHour: number;
  @IsNumber()
  endMinute: number;
  @IsNumber()
  responseTime: number;
  @IsNumber()
  referenceValue: number;
  @IsNumber()
  runUsedIndicator: number;
}

export class UnitDefaultTestRunRecordDTO extends UnitDefaultTestRunBaseDTO {
  id: string;
  unitDefaultTestSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class UnitDefaultTestRunImportDTO extends UnitDefaultTestRunBaseDTO {}

export class UnitDefaultTestRunDTO extends UnitDefaultTestRunRecordDTO {}
