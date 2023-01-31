export class QACertificationEventBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  monitoringSystemID?: string;
  componentID?: string;
  qaCertEventCode: string;
  qaCertEventDate: Date;
  qaCertEventHour?: number;
  requiredTestCode?: string;
  conditionalBeginDate?: Date;
  conditionalBeginHour?: number;
  completionTestDate?: Date;
  completionTestHour?: number;
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
  pendingStatusCode: string;
  evalStatusCode: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class QACertificationEventImportDTO extends QACertificationEventBaseDTO {}

export class QACertificationEventDTO extends QACertificationEventRecordDTO {}
