import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitDefaultTestService } from './unit-default-test.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test')
export class UnitDefaultTestController {
  constructor(private readonly service: UnitDefaultTestService) {}
}
