import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsNotEmpty, ValidationArguments } from 'class-validator';

const KEY = 'Appendix E Heat Input From Gas';

export class AppEHeatInputFromGasBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('APPE-45-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
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
