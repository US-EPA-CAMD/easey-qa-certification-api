const KEY = 'Cycle Time Summary';
export class CycleTimeSummaryBaseDTO {
  totalTime: number;
}

export class CycleTimeSummaryRecordDTO extends CycleTimeSummaryBaseDTO {
  id: string;
  testSumId: string;
  calculatedTotalTime: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class CycleTimeSummaryImportDTO extends CycleTimeSummaryBaseDTO {}

export class CycleTimeSummaryDTO extends CycleTimeSummaryRecordDTO {}
