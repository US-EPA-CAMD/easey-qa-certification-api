import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AirEmissionTestingService } from './air-emission-testing.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Air Emission Testing')
export class AirEmissionTestingController {
  constructor(private readonly service: AirEmissionTestingService) {}
}
