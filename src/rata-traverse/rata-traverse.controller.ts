import { Controller } from '@nestjs/common';
import { RataTraverseService } from './rata-traverse.service';

@Controller('rata-traverse')
export class RataTraverseController {
  constructor(private readonly rataTraverseService: RataTraverseService) {}
}
