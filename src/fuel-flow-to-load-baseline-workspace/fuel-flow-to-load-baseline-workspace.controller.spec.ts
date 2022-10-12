import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadBaselineWorkspaceController } from './fuel-flow-to-load-baseline-workspace.controller';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

describe('FuelFlowToLoadBaselineWorkspaceController', () => {
  let controller: FuelFlowToLoadBaselineWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelFlowToLoadBaselineWorkspaceController],
      providers: [FuelFlowToLoadBaselineWorkspaceService],
    }).compile();

    controller = module.get<FuelFlowToLoadBaselineWorkspaceController>(
      FuelFlowToLoadBaselineWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
