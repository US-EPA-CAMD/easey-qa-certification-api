import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Test')
export class FuelFlowToLoadTestController {
  constructor(private readonly service: FuelFlowToLoadTestService) {}
}
