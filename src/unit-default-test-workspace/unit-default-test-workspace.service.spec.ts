import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';

describe('UnitDefaultTestWorkspaceService', () => {
  let service: UnitDefaultTestWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitDefaultTestWorkspaceService],
    }).compile();

    service = module.get<UnitDefaultTestWorkspaceService>(
      UnitDefaultTestWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
