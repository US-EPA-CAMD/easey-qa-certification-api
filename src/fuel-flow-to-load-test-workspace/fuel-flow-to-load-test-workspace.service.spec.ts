import { Test, TestingModule } from '@nestjs/testing';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

describe('FuelFlowToLoadTestWorkspaceService', () => {
  let service: FuelFlowToLoadTestWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelFlowToLoadTestWorkspaceService],
    }).compile();

    service = module.get<FuelFlowToLoadTestWorkspaceService>(
      FuelFlowToLoadTestWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
