export class MonitorSystemBaseDTO {
  monitoringSystemID: string;
  systemTypeCode: string;
  systemDesignationCode: string;
}

export class MonitorSystemRecordDTO extends MonitorSystemBaseDTO {
  id: string;
  userId: string;
  addDate: string;
  updateDate: string;
}
