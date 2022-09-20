import { Test, TestingModule } from '@nestjs/testing';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

describe('RataTraverseWorkspaceService', () => {
  let service: RataTraverseWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RataTraverseWorkspaceService],
    }).compile();

    service = module.get<RataTraverseWorkspaceService>(RataTraverseWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
