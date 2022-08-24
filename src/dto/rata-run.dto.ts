import { FlowRataRunDTO, FlowRataRunImportDTO } from './flow-rata-run.dto';

const KEY = 'RATA Run';

export class RataRunBaseDTO {
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

export class RataRunRecordDTO extends RataRunBaseDTO {
  id: string;
  rataSumId: string;
  calculatedRataReferenceValue: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataRunImportDTO extends RataRunBaseDTO {
  flowRataRunData: FlowRataRunImportDTO[];
}

export class RataRunDTO extends RataRunRecordDTO {
  flowRataRunData: FlowRataRunDTO[];
}
