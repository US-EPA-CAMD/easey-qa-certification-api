import { FindOneOptions } from 'typeorm';
import { Type } from 'class-transformer';
import { ValidationArguments, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DbLookup } from '@us-epa-camd/easey-common/pipes';

import { Plant } from '../entities/plant.entity';
import { TestSummaryDTO, TestSummaryImportDTO } from './test-summary.dto';

import {
  TestExtensionExemptionDTO,
  TestExtensionExemptionImportDTO,
} from './test-extension-exemption.dto';
import {
  QACertificationEventDTO,
  QACertificationEventImportDTO,
} from './qa-certification-event.dto';

export class QACertificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
  })
  @DbLookup(
    Plant,
    (args: ValidationArguments): FindOneOptions<Plant> => {
      return { where: { orisCode: args.value } };
    },
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('IMPORT-24-A', {
          orisCode: args.value,
        });
      },
    },
  )
  orisCode: number;
}

export class QACertificationImportDTO extends QACertificationBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => TestSummaryImportDTO)
  testSummaryData: TestSummaryImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => QACertificationEventImportDTO)
  certificationEventData: QACertificationEventImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => TestExtensionExemptionImportDTO)
  testExtensionExemptionData: TestExtensionExemptionImportDTO[];
}

export class QACertificationDTO extends QACertificationBaseDTO {
  testSummaryData: TestSummaryDTO[];
  certificationEventData: QACertificationEventDTO[];
  testExtensionExemptionData: TestExtensionExemptionDTO[];
}
