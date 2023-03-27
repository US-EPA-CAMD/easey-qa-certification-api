import {
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
} from './unit-default-test-run.dto';

export class UnitDefaultTestBaseDTO {
  fuelCode: string;
  noxDefaultRate: number;
  operatingConditionCode: string;
  groupID: string;
  numberOfUnitsInGroup: number;
  numberOfTestsForGroup: number;
}

export class UnitDefaultTestRecordDTO extends UnitDefaultTestBaseDTO {
  id: string;
  testSumId: string;
  calculatedNoxDefaultRate: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class UnitDefaultTestImportDTO extends UnitDefaultTestBaseDTO {
  unitDefaultTestRunData: UnitDefaultTestRunImportDTO[];
}

export class UnitDefaultTestDTO extends UnitDefaultTestRecordDTO {
  unitDefaultTestRunData: UnitDefaultTestRunDTO[];
}
