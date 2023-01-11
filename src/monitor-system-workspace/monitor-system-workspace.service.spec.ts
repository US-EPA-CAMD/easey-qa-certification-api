import { Test, TestingModule } from '@nestjs/testing';
import { MonitorSystemWorkspaceService } from './monitor-system-workspace.service';

describe('MonitorSystemWorkspaceService', () => {
  let service: MonitorSystemWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorSystemWorkspaceService],
    }).compile();

    service = module.get<MonitorSystemWorkspaceService>(
      MonitorSystemWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
