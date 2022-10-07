const KEY = 'Appendix E Heat Input From Oil';

export class AppEHeatInputFromOilBaseDTO {
  monitoringSystemID: string;
  oilMass: number;
  oilGCV: number;
  oilGCVUomCode: string;
  oilHeatInput: number;
  oilVolume: number;
  oilVolumeUomCode: string;
  oilDensity: number;
  oilDensityUomCode: string;
  monitoringSystemId: string;
}

export class AppEHeatInputFromOilRecordDTO extends AppEHeatInputFromOilBaseDTO {
  id: string;
  appECorrTestRunId: string;
  calculatedOilMass: number;
  calculatedOilHeatInput: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppEHeatInputFromOilImportDTO extends AppEHeatInputFromOilBaseDTO {}

export class AppEHeatInputFromOilDTO extends AppEHeatInputFromOilRecordDTO {}
