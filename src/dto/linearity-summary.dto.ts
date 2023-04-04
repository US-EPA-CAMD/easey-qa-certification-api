import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';
import {
  LinearityInjectionImportDTO,
  LinearityInjectionDTO,
} from './linearity-injection.dto';
import { GasLevelCode } from '../entities/workspace/gas-level-code.entity';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

const KEY = 'Linearity Summary';

export class LinearitySummaryBaseDTO {
  @ApiProperty({
    description: 'gasLevelCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-15-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(GasLevelCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-15-B', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  gasLevelCode: string;

  @ApiProperty({
    description: 'meanMeasuredValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-16-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  meanMeasuredValue: number;

  @ApiProperty({
    description: 'meanReferenceValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-17-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-17-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  meanReferenceValue: number;

  @ApiProperty({
    description: 'percentError. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-18-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-18-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  percentError: number;

  @ApiProperty(
    getMetadata(dataDictionary.apsIndicator, MetadataKeys.LINEARITY_SUMMARY),
  )
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-37-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  apsIndicator: number;
}

export class LinearitySummaryRecordDTO extends LinearitySummaryBaseDTO {
  id: string;
  testSumId: string;
  calculatedMeanReferenceValue: number;
  calculatedMeanMeasuredValue: number;
  calculatedPercentError: number;
  calculatedAPSIndicator: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class LinearitySummaryImportDTO extends LinearitySummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => LinearityInjectionImportDTO)
  linearityInjectionData: LinearityInjectionImportDTO[];
}

export class LinearitySummaryDTO extends LinearitySummaryRecordDTO {
  linearityInjectionData: LinearityInjectionDTO[];
}
