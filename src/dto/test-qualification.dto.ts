import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
  IsNumber,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  BeginEndDatesConsistent,
  IsInRange,
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import { TestClaimCode } from '../entities/workspace/test-claim-code.entity';

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
  @IsString()
  @IsValidCode(TestClaimCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value] for [fieldname], which is not in the list of valid values for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  beginDate?: Date;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-120-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
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
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-120-C', {
        datefield1: 'beginDate',
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  endDate?: Date;

  @IsOptional()
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
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @ValidateIf(o => o.testClaimCode === 'SLC')
  highLoadPercentage?: number;

  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-10-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 100, {
    message: (args?: ValidationArguments) => {
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
  midLoadPercentage?: number;

  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-11-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
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
  lowLoadPercentage?: number;
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
