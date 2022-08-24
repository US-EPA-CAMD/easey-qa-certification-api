const KEY = 'RATA Run';

export class RataRunBaseDTO {}

export class RataRunRecordDTO extends RataRunBaseDTO {
  id: string;
  rataSummaryId: string;
  runNumber: number;
  beginDate: Date;
  beginHour: number;
  beginMinute: number;
  endDate: Date;
  endHour: number;
  endMinute: number;
  cemValue: number;
  rataReferenceValue: number;
  grossUnitLoad: number;
  runStatusCode: string;
}

export class RataRunImportDTO extends RataRunBaseDTO {}

export class RataRunDTO extends RataRunRecordDTO {}
