export class UnitDefaultTestRunBaseDTO {

  runNumber: number;
  beginDate: Date;
  beginHour: number;
  beginMinute: number;
  endDate: Date;
  endHour: number;
  endMinute: number;
}

export class UnitDefaultTestRunRecordDTO extends UnitDefaultTestRunBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;

}

export class UnitDefaultTestRunImportDTO extends UnitDefaultTestRunBaseDTO {}

export class UnitDefaultTestRunDTO extends UnitDefaultTestRunRecordDTO {}
