import { ApiProperty } from '@nestjs/swagger';

//import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { LinearityInjectionImportDTO, LinearityInjectionDTO } from './linearity-injection.dto';

export class LinearitySummaryBaseDTO {
  @ApiProperty({
    description: 'gasLevelCode. ADD TO PROPERTY METADATA',
  })
  gasLevelCode: string;

  @ApiProperty({
    description: 'meanMeasuredValue. ADD TO PROPERTY METADATA',
  })
  meanMeasuredValue?: number;

  @ApiProperty({
    description: 'meanReferenceValue. ADD TO PROPERTY METADATA',
  })
  meanReferenceValue?: number;

  @ApiProperty({
    description: 'percentError. ADD TO PROPERTY METADATA',
  })
  percentError?: number;

  @ApiProperty({
    description: 'apsIndicator. ADD TO PROPERTY METADATA',
  })
  apsIndicator?: number;
}

export class LinearitySummaryRecordDTO extends LinearitySummaryBaseDTO {
  id: string;
  calculatedMeanReferenceValue: number;
  calculatedMeanMeasuredValue: number;
  calculatedPercentError: number;
  calculatedAPSIndicator: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
}

export class LinearitySummaryImportDTO extends LinearitySummaryBaseDTO {
  linearityInjectionData: LinearityInjectionImportDTO[];  
}

export class LinearitySummaryDTO extends LinearitySummaryRecordDTO {
  linearityInjectionData: LinearityInjectionDTO[];  
}