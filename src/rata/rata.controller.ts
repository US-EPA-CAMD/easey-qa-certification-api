import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RataService } from './rata.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata')
export class RataController {
  constructor(private readonly service: RataService) {}
}
