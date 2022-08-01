import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { ProtocolGas } from '../entities/workspace/protocol-gas.entity';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

const locationId = '121';
const facilityId = 1;
const unitId = '121';
const testSumId = '1';
const userId = 'testuser';
const protocolGas = new ProtocolGas();
const protocolGasDTO = new ProtocolGasDTO();

const mockRepository = () => ({
  find: jest.fn(() => []),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(protocolGasDTO),
  many: jest.fn().mockResolvedValue([protocolGasDTO]),
});

describe('ProtocolGasWorkspaceService', () => {
  let service: ProtocolGasWorkspaceService;
  let repository: ProtocolGasWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolGasWorkspaceService,
        {
          provide: ProtocolGasWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: ProtocolGasMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<ProtocolGasWorkspaceService>(
      ProtocolGasWorkspaceService,
    );
    repository = module.get<ProtocolGasWorkspaceRepository>(
      ProtocolGasWorkspaceRepository,
    );
  });

  describe('getProtocolGases', () => {
    it('calls the repository.find() and get protocol gases by id', async () => {
      const result = await service.getProtocolGases(testSumId);
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
