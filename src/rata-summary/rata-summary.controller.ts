import { Controller } from '@nestjs/common';
import { RataSummaryService } from './rata-summary.service';

@Controller('rata-summary')
export class RataSummaryController {
  constructor(private readonly rataSummaryService: RataSummaryService) {}
}
