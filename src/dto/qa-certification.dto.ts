import { ApiProperty } from '@nestjs/swagger';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';

import { TestSummaryBaseDTO } from './test-summary.dto';

export class QACertificationDTO {

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
  })
  @IsOrisCode({
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  orisCode: string;
  
  testSummaryData: TestSummaryBaseDTO[];
}