import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadTestWorkspaceController } from './fuel-flow-to-load-test-workspace.controller';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

describe('FuelFlowToLoadTestWorkspaceController', () => {
  let controller: FuelFlowToLoadTestWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelFlowToLoadTestWorkspaceController],
      providers: [FuelFlowToLoadTestWorkspaceService],
    }).compile();

    controller = module.get<FuelFlowToLoadTestWorkspaceController>(
      FuelFlowToLoadTestWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
