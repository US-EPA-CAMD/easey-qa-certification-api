const KEY = 'Hg Test Injection';

export class HgInjectionBaseDTO {
  injectionDate: Date;
  injectionHour: number;
  injectionMinute: number;
  measuredValue: number;
  referenceValue: number;
}

export class HgInjectionRecordDTO extends HgInjectionBaseDTO {
  id: string;
  hgTestSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class HgInjectionImportDTO extends HgInjectionBaseDTO {}

export class HgInjectionDTO extends HgInjectionRecordDTO {}
