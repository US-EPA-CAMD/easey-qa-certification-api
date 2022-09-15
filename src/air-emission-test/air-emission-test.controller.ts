import { Controller } from '@nestjs/common';
import { AirEmissionTestService } from './air-emission-test.service';

@Controller('air-emission-test')
export class AirEmissionTestController {
  constructor(
    private readonly airEmissionTestService: AirEmissionTestService,
  ) {}
}
