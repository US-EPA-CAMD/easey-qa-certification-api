import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasRepository } from './protocol-gas.repository';
import { ProtocolGasService } from './protocol-gas.service';

describe('ProtocolGasService', () => {
  let service: ProtocolGasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolGasService,
        ProtocolGasMap,
        {
          provide: ProtocolGasRepository,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    service = module.get<ProtocolGasService>(ProtocolGasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
