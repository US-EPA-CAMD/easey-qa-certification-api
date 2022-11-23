import { Controller } from '@nestjs/common';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

@Controller()
export class CycleTimeInjectionController {
  constructor(private readonly service: CycleTimeInjectionService) {}
}
