import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';

import { RequireOne } from '../pipes/require-one.pipe';
import { IsTestTypeCode } from '../pipes/is-test-type-code.pipe';

// TODO: MAYBE MOVE TO ENUMS IN COMMON
enum TestType {
  SEVENDAY = '7DAY',
  AF2LCHK = 'AF2LCHK',
  APPE = 'APPE',
  BCAL = 'BCAL',
  CYCLE = 'CYCLE',
  DAHS = 'DAHS',
  DAYCAL = 'DAYCAL',
  DGFMCAL = 'DGFMCAL',
  F2LCHK = 'F2LCHK',
  F2LREF = 'F2LREF',
  FF2LBAS = 'FF2LBAS',
  FF2LTST = 'FF2LTST',
  FFACC = 'FFACC',
  FFACCTT = 'FFACCTT',
  HGLINE = 'HGLINE',
  HGSI1 = 'HGSI1',
  HGSI3 = 'HGSI3',
  INTCHK = 'INTCHK',
  LEAK = 'LEAK',
  LINE = 'LINE',
  MFMCAL = 'MFMCAL',
  ONOFF = 'ONOFF',
  OTHER = 'OTHER',
  PEI = 'PEI',
  PEMSACC = 'PEMSACC',
  PEMSCAL = 'PEMSCAL',
  QGA = 'QGA',
  RATA = 'RATA',
  TSCAL = 'TSCAL',
  UNITDEF = 'UNITDEF'
}

export class TestSummaryParamsDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
  })
  @IsOrisCode({
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  facilityId: number;

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.unitId.description,
  })
  @RequireOne('stackPipeId', {
    message: 'A Unit Id or Stack Pipe Id (NOT both) must be provided for each Test Summary.'
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  unitId?: string[];

  @ApiProperty({
    isArray: true,
    description: 'Unique identifier for each stack/pipe at a facility. ADD TO PROPERTY METADATA',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  stackPipeId?: string[];

  @ApiProperty({
    enum: TestType,
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsTestTypeCode({
    each: true,
    message: 'Invalid Test Type Code',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  testTypeCode?: string[];
}
