import { Test, TestingModule } from '@nestjs/testing';
import {
  ProtocolGasBaseDTO,
  ProtocolGasDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { ProtocolGasWorkspaceController } from './protocol-gas.controller';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

const locId = '';
const testSumId = '';
const protocolGasId = '';
const protocolGasRecord = new ProtocolGasRecordDTO();
const protocolGases: ProtocolGasDTO[] = [];
protocolGases.push(protocolGasRecord);

const mockService = () => ({
  getProtocolGas: jest.fn().mockResolvedValue(protocolGasRecord),
  getProtocolGases: jest.fn(),
  createProtocolGas: jest.fn(),
});

const payload: ProtocolGasBaseDTO = {
  gasLevelCode: '',
  gasTypeCode: '',
  vendorID: '',
  cylinderID: '',
  expirationDate: new Date(),
};

describe('Protocol Gas Workspace Controller', () => {
  let controller: ProtocolGasWorkspaceController;
  let service: ProtocolGasWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtocolGasWorkspaceController],
      providers: [
        TestSummaryWorkspaceModule,
        {
          provide: ProtocolGasWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProtocolGasWorkspaceController>(
      ProtocolGasWorkspaceController,
    );
    service = module.get<ProtocolGasWorkspaceService>(
      ProtocolGasWorkspaceService,
    );
  });

  describe('getProtocolGases', () => {
    it('should call the ProtocolGasWorkspaceService.getProtocolGases', async () => {
      jest.spyOn(service, 'getProtocolGases').mockResolvedValue(protocolGases);
      expect(await controller.getProtocolGases(locId, testSumId)).toBe(
        protocolGases,
      );
    });
  });

  describe('getProtocolGas', () => {
    it('Calls the repository to get one Protocol Gas record by Id', async () => {
      const result = await controller.getProtocolGas(
        locId,
        testSumId,
        protocolGasId,
      );
      expect(result).toEqual(protocolGasRecord);
      expect(service.getProtocolGas).toHaveBeenCalled();
    });
  });

  describe('createProtocolGas', () => {
    it('should call the ProtocolGasWorkspaceService.createProtocolGas', async () => {
      jest
        .spyOn(service, 'createProtocolGas')
        .mockResolvedValue(protocolGasRecord);
      expect(
        await controller.createProtocolGas(locId, testSumId, payload),
      ).toEqual(protocolGasRecord);
    });
  });
});
