import { ApiProperty } from '@nestjs/swagger';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';

import { TestSummaryImportDTO, TestSummaryDTO } from './test-summary.dto';

export class QACertificationBaseDTO {

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
  })
  @IsOrisCode({
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  orisCode: number;
}

export class QACertificationImportDTO extends QACertificationBaseDTO {
  testSummaryData: TestSummaryImportDTO[];
}

export class QACertificationDTO extends QACertificationBaseDTO {
  testSummaryData: TestSummaryDTO[];
}
