import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

const KEY = 'Protocol Gas';

export class ProtocolGasBaseDTO {
  gasLevelCode: string;

  @ApiProperty({
    description: 'gasTypeCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('PGVP-9-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  gasTypeCode: string;
  cylinderIdentifier: string;
  vendorIdentifier: string;
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
