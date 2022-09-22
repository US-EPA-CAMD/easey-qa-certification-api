export class AirEmissionTestingBaseDTO {
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

export class AirEmissionTestingRecordDTO extends AirEmissionTestingBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AirEmissionTestingImportDTO extends AirEmissionTestingBaseDTO {}

export class AirEmissionTestingDTO extends AirEmissionTestingRecordDTO {}
