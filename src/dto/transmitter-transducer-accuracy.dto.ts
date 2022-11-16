export class TransmitterTransducerAccuracyBaseDTO {
  lowLevelAccuracy: number;
  lowLevelAccuracySpecCode: string;
  midLevelAccuracy: number;
  midLevelAccuracySpecCode: string;
  highLevelAccuracy: number;
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
