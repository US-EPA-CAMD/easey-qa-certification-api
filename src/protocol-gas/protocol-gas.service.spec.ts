import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasRepository } from './protocol-gas.repository';
import { ProtocolGasService } from './protocol-gas.service';
import { ProtocolGas } from '../entities/protocol-gas.entity';
import { ProtocolGasBaseDTO, ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGasWorkspaceRepository } from '../protocol-gas-workspace/protocol-gas.repository';
import { ProtocolGasWorkspaceService } from '../protocol-gas-workspace/protocol-gas.service';

const protocolGasId = 'a1b2c3';
const testSumId = 'd4e5f6';
const protocolGas = new ProtocolGas();
const protocolGasDTO = new ProtocolGasDTO();

const payload: ProtocolGasBaseDTO = {
  gasLevelCode: '',
  gasTypeCode: '',
  vendorID: '',
  cylinderID: '',
  expirationDate: new Date(),
};

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(protocolGasDTO),
  many: jest.fn().mockResolvedValue([protocolGasDTO]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([protocolGas]),
  create: jest.fn().mockResolvedValue(protocolGas),
  save: jest.fn().mockResolvedValue(protocolGas),
  findOne: jest.fn().mockResolvedValue(protocolGas),
});

describe('ProtocolGasService', () => {
  let service: ProtocolGasService;
  let repository: ProtocolGasRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolGasService,
        ProtocolGasMap,
        {
          provide: ProtocolGasRepository,
          useFactory: mockRepository,
        },
        {
          provide: ProtocolGasMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<ProtocolGasService>(ProtocolGasService);
    repository = module.get<ProtocolGasRepository>(ProtocolGasRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProtocolGas', () => {
    it('Calls repository.findOne({id}) to get a single Protocol Gas record', async () => {
      const result = await service.getProtocolGas(protocolGasId);
      expect(result).toEqual(protocolGasDTO);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Protocol Gas record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getProtocolGas(protocolGasId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('Export', () => {
    it('Should Export Protocol Gas', async () => {
      jest
        .spyOn(service, 'getProtocolGasByTestSumIds')
        .mockResolvedValue([protocolGasDTO]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([protocolGasDTO]);
    });
  });
});
