const KEY = 'Appendix E Heat Input From Gas';

export class AppEHeatInputFromGasBaseDTO {
  monitoringSystemID: string;
  gasGCV: number;
  gasVolume: number;
  gasHeatInput: number;
}

export class AppEHeatInputFromGasRecordDTO extends AppEHeatInputFromGasBaseDTO {
  id: string;
  appECorrTestRunId: string;
  calculatedGasHeatInput: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppEHeatInputFromGasImportDTO extends AppEHeatInputFromGasBaseDTO {}

export class AppEHeatInputFromGasDTO extends AppEHeatInputFromGasRecordDTO {}
