import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CalibrationInjectionService } from './calibration-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Calibration Injection')
export class CalibrationInjectionController {
  constructor(private readonly service: CalibrationInjectionService) {}
}
