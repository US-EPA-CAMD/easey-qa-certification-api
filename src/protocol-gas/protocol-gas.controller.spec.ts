import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasController } from './protocol-gas.controller';
import { ProtocolGasService } from './protocol-gas.service';

describe('ProtocolGasController', () => {
  let controller: ProtocolGasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtocolGasController],
      providers: [
        {
          provide: ProtocolGasService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<ProtocolGasController>(ProtocolGasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
