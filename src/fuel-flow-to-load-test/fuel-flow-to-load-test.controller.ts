import { Controller } from '@nestjs/common';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';

@Controller('fuel-flow-to-load-test')
export class FuelFlowToLoadTestController {
  constructor(
    private readonly fuelFlowToLoadTestService: FuelFlowToLoadTestService,
  ) {}
}
