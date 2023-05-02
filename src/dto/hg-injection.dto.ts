import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsOptional, ValidationArguments } from 'class-validator';

const KEY = 'Hg Test Injection';
const DATE_FORMAT = 'YYYY-MM-DD';

export class HgInjectionBaseDTO {
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
  injectionDate: Date;
  @IsNumber()
  injectionHour: number;
  @IsNumber()
  injectionMinute: number;
  @IsNumber()
  @IsOptional()
  measuredValue?: number;
  @IsOptional()
  @IsNumber()
  referenceValue?: number;
}

export class HgInjectionRecordDTO extends HgInjectionBaseDTO {
  id: string;
  hgTestSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class HgInjectionImportDTO extends HgInjectionBaseDTO {}

export class HgInjectionDTO extends HgInjectionRecordDTO {}
