import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasService } from './protocol-gas.service';

describe('ProtocolGasService', () => {
  let service: ProtocolGasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocolGasService],
    }).compile();

    service = module.get<ProtocolGasService>(ProtocolGasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
