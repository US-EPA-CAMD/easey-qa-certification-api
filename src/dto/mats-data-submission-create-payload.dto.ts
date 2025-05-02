import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';

export class MatsDataSubmissionFilePathsDTO {
  @IsString()
  @IsOptional()
  ertFile?: string;

  @IsString()
  @IsOptional()
  payloadFile?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  supportingFiles?: string[];
}

export class MatsDataSubmissionCreatePayloadDTO {
  @ValidateNested()
  @Type(() => MatsDataSubmissionFilePathsDTO)
  filePaths: MatsDataSubmissionFilePathsDTO;

  @ValidateNested()
  @Type(() => MatsDataSubmissionBaseDTO)
  metadata: MatsDataSubmissionBaseDTO;
}
