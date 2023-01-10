export class QACertificationEventBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  monitoringSystemID: string;
  componentID: string;
  qaCertEventCode: string;
  qaCertEventDate: Date;
  qaCertEventHour: number;
  requiredTestCode: string;
  conditionalBeginDate: Date;
  conditionalBeginHour: number;
  completionTestDate: Date;
  completionTestHour: number;
}

export class QACertificationEventRecordDTO extends QACertificationEventBaseDTO {
  id: string;
  locationId: string;
  lastUpdated: Date;
  updatedStatusFlag: string;
  needsEvalFlag: string;
  checkSessionId: string;
  submissionId: number;
  submissionAvailabilityCode: string;
  pendindStatusCode: string;
  evalStatusCode: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
}

export class QACertificationEventImportDTO extends QACertificationEventBaseDTO {}

export class QACertificationEventDTO extends QACertificationEventRecordDTO {}
