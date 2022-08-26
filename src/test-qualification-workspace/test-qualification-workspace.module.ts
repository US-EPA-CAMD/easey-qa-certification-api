import { Module } from '@nestjs/common';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';
import { TestQualificationWorkspaceController } from './test-qualification-workspace.controller';

@Module({
  controllers: [TestQualificationWorkspaceController],
  providers: [TestQualificationWorkspaceService]
})
export class TestQualificationWorkspaceModule {}
