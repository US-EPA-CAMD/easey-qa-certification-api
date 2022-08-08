import { Test, TestingModule } from '@nestjs/testing';
import { RataWorkspaceController } from './rata-workspace.controller';
import { RataWorkspaceService } from './rata-workspace.service';

const mockService = () => ({});

describe('RataWorkspaceController', () => {
  let controller: RataWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataWorkspaceController],
      providers: [
        {
          provide: RataWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<RataWorkspaceController>(RataWorkspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
