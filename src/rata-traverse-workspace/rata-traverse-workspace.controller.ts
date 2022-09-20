import { Controller } from '@nestjs/common';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

@Controller()
export class RataTraverseWorkspaceController {
  constructor(private readonly service: RataTraverseWorkspaceService) {}
}
