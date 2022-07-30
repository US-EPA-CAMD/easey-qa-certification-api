import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

describe('ProtocolGasWorkspaceService', () => {
  let service: ProtocolGasWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolGasWorkspaceService,
        ProtocolGasMap,
        {
          provide: ProtocolGasWorkspaceRepository,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    service = module.get<ProtocolGasWorkspaceService>(
      ProtocolGasWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
