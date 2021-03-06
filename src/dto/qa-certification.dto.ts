import { FindOneOptions } from 'typeorm';
import { Type } from 'class-transformer';
import { ValidationArguments, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { DbLookup } from '../pipes/db-lookup.pipe';
import { Plant } from '../entities/plant.entity';

import { TestSummaryDTO, TestSummaryImportDTO } from './test-summary.dto';

import {
  CertificationEventDTO,
  CertificationEventImportDTO,
} from './certification-event.dto';

import {
  TestExtensionExemptionDTO,
  TestExtensionExemptionImportDTO,
} from './test-extension-exemption.dto';

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
        return `The database does not contain any Facility with Oris Code ${args.value}`;
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
  @Type(() => CertificationEventImportDTO)
  certificationEventData: CertificationEventImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => TestExtensionExemptionImportDTO)
  testExtensionExemptionData: TestExtensionExemptionImportDTO[];
}

export class QACertificationDTO extends QACertificationBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => TestSummaryDTO)
  testSummaryData: TestSummaryDTO[];

  @ValidateNested({ each: true })
  @Type(() => CertificationEventDTO)
  certificationEventData: CertificationEventDTO[];

  @ValidateNested({ each: true })
  @Type(() => TestExtensionExemptionDTO)
  testExtensionExemptionData: TestExtensionExemptionDTO[];
}
