import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import { GasLevelCode } from '../entities/workspace/gas-level-code.entity';
import { GasComponentCode } from '../entities/gas-component-code.entity';
import { IsValidCodes } from '../pipes/is-valid-codes.pipe';
import { FindOneOptions, In } from 'typeorm';

const KEY = 'Protocol Gas';
const DATE_FORMAT = 'YYYY-MM-DD';

export class ProtocolGasBaseDTO {
  @IsString()
  @IsNotEmpty()
  @IsValidCode(GasLevelCode, {
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
  gasLevelCode: string;

  @ApiProperty({
    description: 'gasTypeCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('PGVP-12-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @IsValidCodes(
    GasComponentCode,
    (args: ValidationArguments): FindOneOptions<GasComponentCode> => {
      let codes = args.value.split(',');
      return { where: { gasComponentCode: In(codes) } };
    },
    {
      message: (args: ValidationArguments) => {
        return `You reported the value [${args.value}] for [${args.property}], all or some of the codes are not in the list of valid values.`;
      },
    },
  )
  gasTypeCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(25, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the ${KEY} record [${args.property}] must not exceed 25 characters`;
    },
  })
  cylinderIdentifier?: string;

  @IsOptional()
  @IsString()
  @MatchesRegEx('([A-Z0-9]{1,8})*', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 8 characters and only consist of upper letters and numbers for [${KEY}].`;
    },
  })
  vendorIdentifier?: string;

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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  expirationDate?: Date;
}

export class ProtocolGasRecordDTO extends ProtocolGasBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class ProtocolGasImportDTO extends ProtocolGasBaseDTO {}

export class ProtocolGasDTO extends ProtocolGasRecordDTO {}
