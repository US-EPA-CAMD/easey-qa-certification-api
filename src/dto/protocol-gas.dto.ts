export class ProtocolGasBaseDTO {
  gasLevelCode: string;
  gasTypeCode: string;
  vendorID: string;
  cylinderID: string;
  expirationDate: Date;
}

export class ProtocolGasRecordDTO extends ProtocolGasBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
}

export class ProtocolGasImportDTO extends ProtocolGasBaseDTO {}

export class ProtocolGasDTO extends ProtocolGasRecordDTO {}
