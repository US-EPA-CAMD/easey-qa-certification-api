export class AirEmissionTestBaseDTO {
  qiLastName: string;
  qiFirstName: string;
  qiMiddleInitial: string;
  aetbName: string;
  aetbPhoneNumber: string;
  aetbEmail: string;
  examDate: Date;
  providerName: string;
  providerEmail: string;
}

export class AirEmissionTestRecordDTO extends AirEmissionTestBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AirEmissionTestImportDTO extends AirEmissionTestBaseDTO {}

export class AirEmissionTestDTO extends AirEmissionTestRecordDTO {}
