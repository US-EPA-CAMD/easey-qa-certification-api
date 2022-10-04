export class AppEHeatInputFromOilBaseDTO {
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

export class AppEHeatInputFromOilRecordDTO extends AppEHeatInputFromOilBaseDTO {
  id: string;
  appECorrelationTestId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppEHeatInputFromOilImportDTO extends AppEHeatInputFromOilBaseDTO {}

export class AppEHeatInputFromOilDto extends AppEHeatInputFromOilRecordDTO {}