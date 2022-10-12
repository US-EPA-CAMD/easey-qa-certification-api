import { Test, TestingModule } from '@nestjs/testing';
import { FlowToLoadReferenceWorkspaceController } from './flow-to-load-reference-workspace.controller';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';

describe('AppendixETestSummaryWorkspaceController', () => {
  let controller: FlowToLoadReferenceWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowToLoadReferenceWorkspaceController],
      providers: [FlowToLoadReferenceWorkspaceService],
    }).compile();

    controller = module.get<FlowToLoadReferenceWorkspaceController>(
      FlowToLoadReferenceWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
