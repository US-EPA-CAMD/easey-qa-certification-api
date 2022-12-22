export class ProtocolGasBaseDTO {
  gasLevelCode: string;
  gasTypeCode: string;
  cylinderIdentifier: string;
  vendorIdentifier: string;
  expirationDate: Date;
}

export class ProtocolGasRecordDTO extends ProtocolGasBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class ProtocolGasImportDTO extends ProtocolGasBaseDTO {}

export class ProtocolGasDTO extends ProtocolGasRecordDTO {}
