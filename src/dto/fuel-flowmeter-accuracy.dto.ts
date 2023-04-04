import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsString, ValidationArguments } from 'class-validator';

const KEY = 'Fuel Flowmeter Accuracy';
const DATE_FORMAT = 'YYYY-MM-DD';
export class FuelFlowmeterAccuracyBaseDTO {
  @IsString()
  accuracyTestMethodCode: string;
  @IsNumber()
  lowFuelAccuracy: number;
  @IsNumber()
  midFuelAccuracy: number;
  @IsNumber()
  highFuelAccuracy: number;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  reinstallationDate: string;
  @IsNumber()
  reinstallationHour: number;
}

export class FuelFlowmeterAccuracyRecordDTO extends FuelFlowmeterAccuracyBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FuelFlowmeterAccuracyImportDTO extends FuelFlowmeterAccuracyBaseDTO {}

export class FuelFlowmeterAccuracyDTO extends FuelFlowmeterAccuracyRecordDTO {}
