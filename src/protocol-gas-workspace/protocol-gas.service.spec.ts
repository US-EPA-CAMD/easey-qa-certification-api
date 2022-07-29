import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

describe('ProtocolGasWorkspaceService', () => {
  let service: ProtocolGasWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocolGasWorkspaceService],
    }).compile();

    service = module.get<ProtocolGasWorkspaceService>(
      ProtocolGasWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
