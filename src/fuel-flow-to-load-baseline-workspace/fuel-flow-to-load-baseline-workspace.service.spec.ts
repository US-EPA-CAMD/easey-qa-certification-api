import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

describe('FuelFlowToLoadBaselineWorkspaceService', () => {
  let service: FuelFlowToLoadBaselineWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelFlowToLoadBaselineWorkspaceService],
    }).compile();

    service = module.get<FuelFlowToLoadBaselineWorkspaceService>(
      FuelFlowToLoadBaselineWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
