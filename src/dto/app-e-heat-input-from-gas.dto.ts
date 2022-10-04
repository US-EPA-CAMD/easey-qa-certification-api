const KEY = 'Appendix E Heat Input From Gas';

export class AppEHeatInputFromGasBaseDTO {
  gasVolume: number;
  gasGCV: number;
  gasHeatInput: number;
  monitoringSystemId: string;
}

export class AppEHeatInputFromGasRecordDTO extends AppEHeatInputFromGasBaseDTO {
  id: string;
  appECorrelationTestRunId: string;
  calculatedGasHeatInput: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class AppEHeatInputFromGasImportDTO extends AppEHeatInputFromGasBaseDTO {}

export class AppEHeatInputFromGasDTO extends AppEHeatInputFromGasRecordDTO {}
