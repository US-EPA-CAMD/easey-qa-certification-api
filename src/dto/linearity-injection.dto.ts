import { ApiProperty } from '@nestjs/swagger';

//import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

export class LinearityInjectionBaseDTO {
  @ApiProperty({
    description: 'injectionDate. ADD TO PROPERTY METADATA',
  })
  injectionDate: Date;

  @ApiProperty({
    description: 'injectionHour. ADD TO PROPERTY METADATA',
  })
  injectionHour: number;

  @ApiProperty({
    description: 'injectionMinute. ADD TO PROPERTY METADATA',
  })
  injectionMinute: number;

  @ApiProperty({
    description: 'measuredValue. ADD TO PROPERTY METADATA',
  })
  measuredValue?: number;

  @ApiProperty({
    description: 'referenceValue. ADD TO PROPERTY METADATA',
  })
  referenceValue?: number;
}

export class LinearityInjectionRecordDTO extends LinearityInjectionBaseDTO {
  id: string;
  linSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class LinearityInjectionImportDTO extends LinearityInjectionBaseDTO {
}

export class LinearityInjectionDTO extends LinearityInjectionRecordDTO {
}