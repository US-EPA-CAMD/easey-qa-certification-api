import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AirEmissionTestService } from './air-emission-test.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Air Emission Testing')
export class AirEmissionTestController {
  constructor(
    private readonly airEmissionTestService: AirEmissionTestService,
  ) {}
}
