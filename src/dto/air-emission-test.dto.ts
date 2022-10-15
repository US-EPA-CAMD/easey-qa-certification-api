import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsEmail } from '@us-epa-camd/easey-common/pipes';
import { IsNotEmpty, ValidationArguments } from 'class-validator';

const KEY = 'Air Emission Testing';

export class AirEmissionTestingBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-1-A', {
        fieldname: args.property,
        key: KEY,
      });
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
  qiFirstName: string;

  qiMiddleInitial: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('AETB-4-A', {
        fieldname: args.property,
        key: KEY,
      });
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
  aetbEmail: string;

  examDate: Date;
  providerName: string;
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
