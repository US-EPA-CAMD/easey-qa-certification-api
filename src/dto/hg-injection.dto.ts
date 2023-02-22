import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { ValidationArguments } from 'class-validator';

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
  injectionHour: number;
  injectionMinute: number;
  measuredValue: number;
  referenceValue: number;
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
