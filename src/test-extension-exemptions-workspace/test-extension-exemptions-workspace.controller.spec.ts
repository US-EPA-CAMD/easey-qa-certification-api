import { Test, TestingModule } from '@nestjs/testing';
import { TestExtensionExemptionsWorkspaceController } from './test-extension-exemptions-workspace.controller';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

describe('TestExtensionExemptionsWorkspaceController', () => {
  let controller: TestExtensionExemptionsWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestExtensionExemptionsWorkspaceController],
      providers: [TestExtensionExemptionsWorkspaceService],
    }).compile();

    controller = module.get<TestExtensionExemptionsWorkspaceController>(
      TestExtensionExemptionsWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
