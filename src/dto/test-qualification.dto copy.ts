const KEY = 'Test Qualification';

export class TestQualificationBaseDTO {
  testClaimCode: string
  beginDate: Date
  endDate: Date
  highLoadPercentage: number
  midLoadPercentage: number
  lowLoadPercentage: number
}

export class TestQualificationRecordDTO extends TestQualificationBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class TestQualificationImportDTO extends TestQualificationBaseDTO {}

export class TestQualificationDTO extends TestQualificationRecordDTO {}
