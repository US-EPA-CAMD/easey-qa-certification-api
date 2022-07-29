import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasWorkspaceController } from './protocol-gas.controller';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

describe('ProtocolGasWorkspaceController', () => {
  let controller: ProtocolGasWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtocolGasWorkspaceController],
      providers: [ProtocolGasWorkspaceService],
    }).compile();

    controller = module.get<ProtocolGasWorkspaceController>(
      ProtocolGasWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
