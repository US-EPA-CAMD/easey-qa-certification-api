import { IsNotEmpty, ValidateIf, ValidationArguments } from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

const KEY = 'Test Qualification';
const HIGH_LOAD_PERCENTAGE_MIN_VALUE = 0;
const HIGH_LOAD_PERCENTAGE_MAX_VALUE = 100;

export class TestQualificationBaseDTO {
  testClaimCode: string;
  beginDate: Date;
  endDate: Date;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-9-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-9-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: HIGH_LOAD_PERCENTAGE_MIN_VALUE,
        maxvalue: HIGH_LOAD_PERCENTAGE_MAX_VALUE,
      });
    },
  })
  @ValidateIf(o => o.testClaimCode === 'SLC')
  highLoadPercentage: number;
  midLoadPercentage: number;
  lowLoadPercentage: number;
}

export class TestQualificationRecordDTO extends TestQualificationBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class TestQualificationImportDTO extends TestQualificationBaseDTO {}

export class TestQualificationDTO extends TestQualificationRecordDTO {}
