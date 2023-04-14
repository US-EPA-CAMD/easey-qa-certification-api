import { IsNumber, IsOptional, IsString } from 'class-validator';
export class TransmitterTransducerAccuracyBaseDTO {
  @IsOptional()
  @IsNumber()
  lowLevelAccuracy?: number;
  @IsOptional()
  @IsString()
  lowLevelAccuracySpecCode?: string;
  @IsOptional()
  @IsNumber()
  midLevelAccuracy?: number;
  @IsOptional()
  @IsString()
  midLevelAccuracySpecCode?: string;
  @IsOptional()
  @IsNumber()
  highLevelAccuracy?: number;
  @IsOptional()
  @IsString()
  highLevelAccuracySpecCode?: string;
}

export class TransmitterTransducerAccuracyRecordDTO extends TransmitterTransducerAccuracyBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class TransmitterTransducerAccuracyImportDTO extends TransmitterTransducerAccuracyBaseDTO {}

export class TransmitterTransducerAccuracyDTO extends TransmitterTransducerAccuracyRecordDTO {}
