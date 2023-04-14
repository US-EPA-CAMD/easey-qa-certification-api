import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsOptional, ValidationArguments } from 'class-validator';

const DATE_FORMAT = 'YYYY-MM-DD';
const KEY = 'Unit Default Test Run';
export class UnitDefaultTestRunBaseDTO {
  @IsNumber()
  operatingLevelForRun: number;
  @IsNumber()
  runNumber: number;

  @IsOptional()
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
  beginDate?: Date;
  @IsOptional()
  @IsNumber()
  beginHour?: number;
  @IsOptional()
  @IsNumber()
  beginMinute?: number;

  @IsOptional()
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
  endDate?: Date;
  @IsOptional()
  @IsNumber()
  endHour?: number;
  @IsOptional()
  @IsNumber()
  endMinute?: number;
  @IsOptional()
  @IsNumber()
  responseTime?: number;
  @IsOptional()
  @IsNumber()
  referenceValue?: number;
  @IsOptional()
  @IsNumber()
  runUsedIndicator?: number;
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
