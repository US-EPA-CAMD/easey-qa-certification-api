import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QACertificationDataTypes } from '../enums/qa-certification-data-types.enum';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class WhatHasDataParamsDTO {
  @ApiProperty({
    enum: QACertificationDataTypes,
  })
  @IsString()
  dataType: QACertificationDataTypes;

  @ApiPropertyOptional({
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  workspace: boolean;
}

export default WhatHasDataParamsDTO;
