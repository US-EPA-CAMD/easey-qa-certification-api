import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasController } from './protocol-gas.controller';
import { ProtocolGasService } from './protocol-gas.service';
import { ProtocolGasDTO } from '../dto/protocol-gas.dto';

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const protocolGasId = 'g7h8i9';

const protocolGasDTO = new ProtocolGasDTO();

const mockProtocolGasService = () => ({
  getProtocolGas: jest.fn().mockResolvedValue(protocolGasDTO)
});

describe('ProtocolGasController', () => {
  let controller: ProtocolGasController;
  let service: ProtocolGasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtocolGasController],
      providers: [
        {
          provide: ProtocolGasService,
          useFactory: mockProtocolGasService
        }
      ],
    }).compile();

    controller = module.get<ProtocolGasController>(ProtocolGasController);
    service = module.get<ProtocolGasService>(ProtocolGasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProtocolGas', () => {

    it('Calls the repository to get one Protocol Gas record by Id', async () => {
      const result = await controller.getProtocolGas(
        locId,
        testSumId,
        protocolGasId
      );
      expect(result).toEqual(protocolGasDTO);
      expect(service.getProtocolGas).toHaveBeenCalled();
    })
  })

});
