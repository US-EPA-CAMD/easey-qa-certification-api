import {
  IsNotEmpty,
  MinDate,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';

const KEY = 'Test Qualification';
const LOAD_PERCENTAGE_MIN_VALUE = 0;
const LOAD_PERCENTAGE_MAX_VALUE = 100;
const MIN_BEGIN_DATE = '1993-01-01';
const DATE_FORMAT = 'YYYY-MM-DD';

export class TestQualificationBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-118-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  testClaimCode: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-119-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT} for [${KEY}].`;
    },
  })
  beginDate: Date;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-120-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `You reported [${args.property}] which must be a valid ISO date format of ${DATE_FORMAT} for [${KEY}].`;
    },
  })
  endDate: Date;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-9-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-9-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: LOAD_PERCENTAGE_MIN_VALUE,
        maxvalue: LOAD_PERCENTAGE_MAX_VALUE,
      });
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  highLoadPercentage: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-10-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-10-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: LOAD_PERCENTAGE_MIN_VALUE,
        maxvalue: LOAD_PERCENTAGE_MAX_VALUE,
      });
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  midLoadPercentage: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-11-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-11-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: LOAD_PERCENTAGE_MIN_VALUE,
        maxvalue: LOAD_PERCENTAGE_MAX_VALUE,
      });
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  lowLoadPercentage: number;
}

export class TestQualificationRecordDTO extends TestQualificationBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class TestQualificationImportDTO extends TestQualificationBaseDTO {}

export class TestQualificationDTO extends TestQualificationRecordDTO {}
