import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';

export class MatsDataSubmissionFileNamesDTO {
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
  @Type(() => MatsDataSubmissionFileNamesDTO)
  fileNames: MatsDataSubmissionFileNamesDTO;

  // Do not validate this here, it will be validated in `MatsDataSubmissionChecksService`.
  metadata: MatsDataSubmissionBaseDTO;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  userEmail: string;
}
