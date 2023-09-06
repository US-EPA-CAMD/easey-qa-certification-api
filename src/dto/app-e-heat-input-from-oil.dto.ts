import { IsNumber, IsOptional, IsString } from 'class-validator';
const KEY = 'Appendix E Heat Input From Oil';

export class AppEHeatInputFromOilBaseDTO {
  @IsString()
  monitoringSystemId: string;
  @IsOptional()
  @IsNumber()
  oilMass?: number;
  @IsOptional()
  @IsNumber()
  oilGCV?: number;
  @IsOptional()
  @IsString()
  oilGCVUnitsOfMeasureCode?: string;
  @IsOptional()
  @IsNumber()
  oilHeatInput?: number;
  @IsOptional()
  @IsNumber()
  oilVolume?: number;
  @IsOptional()
  @IsString()
  oilVolumeUnitsOfMeasureCode?: string;
  @IsOptional()
  @IsNumber()
  oilDensity?: number;
  @IsOptional()
  @IsString()
  oilDensityUnitsOfMeasureCode?: string;
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
