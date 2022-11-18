import { Test, TestingModule } from '@nestjs/testing';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RataTraverseChecksService } from './rata-traverse-checks.service';

describe('RataTraverseWorkspaceController', () => {
  let controller: RataTraverseWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [RataTraverseWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: RataTraverseWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: RataTraverseChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    controller = module.get<RataTraverseWorkspaceController>(
      RataTraverseWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
