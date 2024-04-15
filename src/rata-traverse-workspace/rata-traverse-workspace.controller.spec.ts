import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { DataSource } from 'typeorm';

import { RataTraverseChecksService } from './rata-traverse-checks.service';
import { RataTraverseWorkspaceController } from './rata-traverse-workspace.controller';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

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
          provide: DataSource,
          useValue: {},
        },
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
