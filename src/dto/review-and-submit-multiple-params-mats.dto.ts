import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class ReviewAndSubmitMultipleParamsMatsDTO {
  @ApiProperty({
    isArray: true,
    description: 'Array of oris codes',
  })
  @Transform(({ value }) =>
    value.split('|').map((item: string) => parseInt(item.trim())),
  )
  @IsArray()
  orisCodes: number[];

  @ApiProperty({
    isArray: true,
    description: 'Array of configurations',
  })
  @ApiPropertyOptional()
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  @IsOptional()
  @IsArray()
  monPlanIds: string[];
}
