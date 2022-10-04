export class AppEHeatInputOilBaseDTO {
  oilMass: number;
  calculatedOilMass: number;
  oilHeatInput: number;
  calculatedOilHeatInput: number;
  oilGCV: number;
  oilGCVUnitsOfMeasureCode: string;
  oilVolume: number;
  oilVolumeUnitsOfMeasureCode: string;
  oilDensity: number
  oilDensityUnitsOfMeasureCode: string;
  monitoringSystemId: string;
}

export class AppEHeatInputOilRecordDTO extends AppEHeatInputOilBaseDTO {
  id: string;
  appECorrelationTestId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppEHeatInputOilImportDTO extends AppEHeatInputOilBaseDTO {}

export class AppEHeatInputOilDTO extends AppEHeatInputOilRecordDTO {}