import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsEmail,
  IsIsoFormat,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidationArguments,
} from 'class-validator';

const KEY = 'Air Emission Testing';
const DATE_FORMAT = 'YYYY-MM-DD';

export class AirEmissionTestingBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-1-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MaxLength(25, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 25 characters`;
    },
  })
  qiLastName: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-2-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MaxLength(25, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 25 characters`;
    },
  })
  qiFirstName: string;

  @IsOptional()
  @MaxLength(1, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-3-A', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  qiMiddleInitial?: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-4-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MaxLength(50, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 50 characters`;
    },
  })
  aetbName: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-5-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MaxLength(18, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 18 characters`;
    },
  })
  aetbPhoneNumber: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-6-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsEmail({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-6-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MaxLength(70, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 70 characters`;
    },
  })
  aetbEmail: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-9-A', {
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
      return `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}].`;
    },
  })
  examDate: Date;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-7-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MaxLength(50, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 50 characters`;
    },
  })
  providerName: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-8-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsEmail({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-8-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MaxLength(70, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 70 characters`;
    },
  })
  providerEmail: string;
}

export class AirEmissionTestingRecordDTO extends AirEmissionTestingBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AirEmissionTestingImportDTO extends AirEmissionTestingBaseDTO {}

export class AirEmissionTestingDTO extends AirEmissionTestingRecordDTO {}
