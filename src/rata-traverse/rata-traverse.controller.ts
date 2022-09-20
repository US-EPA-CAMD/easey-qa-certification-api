import { Controller } from '@nestjs/common';
import { RataTraverseService } from './rata-traverse.service';

@Controller()
export class RataTraverseController {
<<<<<<< HEAD
  constructor(private readonly service: RataTraverseService) {}
=======
  constructor(private readonly rataTraverseService: RataTraverseService) {}
>>>>>>> bbdbaaf (add POST RATA Traverse endpoint)
}
