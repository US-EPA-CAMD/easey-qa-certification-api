import { IsNumber, IsString } from 'class-validator';
const KEY = 'Appendix E Heat Input From Oil';

export class AppEHeatInputFromOilBaseDTO {
  @IsString()
  monitoringSystemID: string;
  @IsNumber()
  oilMass: number;
  @IsNumber()
  oilGCV: number;
  @IsString()
  oilGCVUnitsOfMeasureCode: string;
  @IsNumber()
  oilHeatInput: number;
  @IsNumber()
  oilVolume: number;
  @IsString()
  oilVolumeUnitsOfMeasureCode: string;
  @IsNumber()
  oilDensity: number;
  @IsString()
  oilDensityUnitsOfMeasureCode: string;
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
