import { Test, TestingModule } from '@nestjs/testing';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

describe('TestQualificationWorkspaceService', () => {
  let service: TestQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestQualificationWorkspaceService],
    }).compile();

    service = module.get<TestQualificationWorkspaceService>(
      TestQualificationWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
