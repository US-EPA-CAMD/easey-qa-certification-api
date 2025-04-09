import {ConfigService} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {Logger} from '@us-epa-camd/easey-common/logger';
import {EntityManager} from 'typeorm';

import {
  ProtocolGasBaseDTO,
  ProtocolGasDTO,
  ProtocolGasImportDTO,
} from '../dto/protocol-gas.dto';
import {ProtocolGas} from '../entities/workspace/protocol-gas.entity';
import {ProtocolGasMap} from '../maps/protocol-gas.map';
import {ProtocolGasRepository} from '../protocol-gas/protocol-gas.repository';
import {TestSummaryWorkspaceService} from '../test-summary-workspace/test-summary.service';
import {ProtocolGasWorkspaceRepository} from './protocol-gas.repository';
import {ProtocolGasWorkspaceService} from './protocol-gas.service';

const protocolGasId = 'a1b2c3';
const testSumId = '1';
const userId = 'testuser';
const protocolGas = new ProtocolGas();
const protocolGasDTO = new ProtocolGasDTO();

const payload: ProtocolGasBaseDTO = {
  gasLevelCode: '',
  gasTypeCode: '',
  vendorIdentifier: '',
  cylinderIdentifier: '',
  expirationDate: new Date(),
};

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([protocolGas]),
  create: jest.fn().mockResolvedValue(protocolGas),
  save: jest.fn().mockResolvedValue(protocolGas),
  findOneBy: jest.fn().mockResolvedValue(protocolGas),
});

const mockHistoricalRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(protocolGas),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(protocolGasDTO),
  many: jest.fn().mockResolvedValue([protocolGasDTO]),
});

describe('ProtocolGasWorkspaceService', () => {
  let service: ProtocolGasWorkspaceService;
  let repository: ProtocolGasWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        ProtocolGasWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: ProtocolGasWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: ProtocolGasRepository,
          useFactory: mockHistoricalRepository,
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
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
  });

  describe('getProtocolGases', () => {
    it('calls the repository.find() and get protocol gases by id', async () => {
      const result = await service.getProtocolGases(testSumId);
      expect(result).toEqual([protocolGasDTO]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getProtocolGas', () => {
    it('Calls repository.findOneBy({id}) to get a single Protocol Gas record', async () => {
      const result = await service.getProtocolGas(protocolGasId);
      expect(result).toEqual(protocolGasDTO);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Protocol Gas record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getProtocolGas(protocolGasId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createProtocolGas', () => {
    it('calls the repository.create() and insert a protocol gas record', async () => {
      const result = await service.createProtocolGas(
        testSumId,
        payload,
        userId,
      );
      expect(result).toEqual(protocolGasDTO);
      expect(repository.create).toHaveBeenCalled();
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

  describe('Import', () => {
    it('Should Import Protocol Gas', async () => {
      jest
        .spyOn(service, 'createProtocolGas')
        .mockResolvedValue(protocolGasDTO);

      await service.import(testSumId, new ProtocolGasImportDTO(), userId);
    });

    it('Should Import Protocol Gas with transaction', async () => {
      jest
        .spyOn(service, 'createProtocolGas')
        .mockResolvedValue(protocolGasDTO);

      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      await service.import(testSumId, new ProtocolGasImportDTO(), userId, mockTrx);

      // Verify createProtocolGas was called with transaction
      expect(service.createProtocolGas).toHaveBeenCalledWith(
        testSumId,
        expect.any(Object),
        userId,
        expect.any(Boolean),
        mockTrx,
      );
    });
  });

  describe('Transaction Support', () => {
    it('Should use transaction entity manager when provided', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue(protocolGas),
          save: jest.fn().mockResolvedValue(protocolGas),
          findOneBy: jest.fn().mockResolvedValue(protocolGas),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call createProtocolGas with transaction
      await service.createProtocolGas(
        testSumId,
        payload,
        userId,
        false,
        mockTrx,
      );

      // Verify transaction was used
      expect(mockTrx.getRepository).toHaveBeenCalled();

      // Verify transaction was passed to child service
      expect(resetSpy).toHaveBeenCalledWith(
        testSumId,
        userId,
        expect.any(Boolean),
        mockTrx,
      );
    });
  });
});
