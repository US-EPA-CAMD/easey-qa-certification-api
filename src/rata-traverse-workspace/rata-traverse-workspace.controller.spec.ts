import { Test, TestingModule } from '@nestjs/testing';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

describe('RataTraverseWorkspaceController', () => {
  let controller: RataTraverseWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataTraverseWorkspaceController],
      providers: [RataTraverseWorkspaceService],
    }).compile();

    controller = module.get<RataTraverseWorkspaceController>(
      RataTraverseWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
