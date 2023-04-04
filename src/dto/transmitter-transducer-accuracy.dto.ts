import { IsNumber, IsString } from 'class-validator';
export class TransmitterTransducerAccuracyBaseDTO {
  @IsNumber()
  lowLevelAccuracy: number;
  @IsString()
  lowLevelAccuracySpecCode: string;
  @IsNumber()
  midLevelAccuracy: number;
  @IsString()
  midLevelAccuracySpecCode: string;
  @IsNumber()
  highLevelAccuracy: number;
  @IsString()
  highLevelAccuracySpecCode: string;
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
