import { Controller } from '@nestjs/common';
import { RataTraverseService } from './rata-traverse.service';

@Controller()
export class RataTraverseController {
  constructor(private readonly rataTraverseService: RataTraverseService) {}
}
