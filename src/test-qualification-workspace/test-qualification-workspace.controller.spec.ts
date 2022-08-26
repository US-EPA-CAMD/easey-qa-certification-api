import { Test, TestingModule } from '@nestjs/testing';
import { TestQualificationWorkspaceController } from './test-qualification-workspace.controller';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

describe('TestQualificationWorkspaceController', () => {
  let controller: TestQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestQualificationWorkspaceController],
      providers: [TestQualificationWorkspaceService],
    }).compile();

    controller = module.get<TestQualificationWorkspaceController>(TestQualificationWorkspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
