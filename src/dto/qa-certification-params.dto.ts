import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';

export class QACertificationParamsDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
  })
  @IsOrisCode({
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  facilityId: number;

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.unitId.description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  unitId?: string[];

  @ApiProperty({
    isArray: true,
    description: 'Unique identifier for each stack/pipe at a facility. ADD TO PROPERTY METADATA',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  stackPipeId?: string[];
}
