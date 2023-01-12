import { Test, TestingModule } from '@nestjs/testing';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

describe('TestExtensionExemptionsWorkspaceService', () => {
  let service: TestExtensionExemptionsWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestExtensionExemptionsWorkspaceService],
    }).compile();

    service = module.get<TestExtensionExemptionsWorkspaceService>(
      TestExtensionExemptionsWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
