import { Get, Controller, Query } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { WhatHasDataService } from './what-has-data.service';
import { WhatHasDataParamsDTO } from '../dto/what-has-data.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('What Has Data')
export class WhatHasDataController {
  constructor(private service: WhatHasDataService) {}

  @Get()
  whatHasData(
    @Query() dto: WhatHasDataParamsDTO,
  ): Promise<any> {
    return this.service.whatHasData(dto.dataType, dto.workspace);
  }
}
