import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestWorkspaceController } from './unit-default-test-workspace.controller';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';

describe('UnitDefaultTestWorkspaceController', () => {
  let controller: UnitDefaultTestWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitDefaultTestWorkspaceController],
      providers: [UnitDefaultTestWorkspaceService],
    }).compile();

    controller = module.get<UnitDefaultTestWorkspaceController>(
      UnitDefaultTestWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
