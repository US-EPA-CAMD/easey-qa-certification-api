import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RataTraverseService } from './rata-traverse.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Traverse')
export class RataTraverseController {
  constructor(private readonly rataTraverseService: RataTraverseService) {}
}
