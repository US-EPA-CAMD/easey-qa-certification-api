import { Controller } from '@nestjs/common';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

@Controller('test-qualification-workspace')
export class TestQualificationWorkspaceController {
  constructor(private readonly testQualificationWorkspaceService: TestQualificationWorkspaceService) {}
}
