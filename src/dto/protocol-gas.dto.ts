import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';

const KEY = 'Protocol Gas';
const DATE_FORMAT = 'YYYY-MM-DD';

export class ProtocolGasBaseDTO {
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
  gasTypeCode: string;
  cylinderIdentifier: string;
  vendorIdentifier: string;

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
  expirationDate: Date;
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
