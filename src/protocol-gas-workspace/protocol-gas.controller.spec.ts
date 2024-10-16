import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

import {
  ProtocolGasBaseDTO,
  ProtocolGasDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
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

const mockCheckService = () => ({
  runChecks: jest.fn().mockResolvedValue([]),
});

const payload: ProtocolGasBaseDTO = {
  gasLevelCode: '',
  gasTypeCode: '',
  vendorIdentifier: '',
  cylinderIdentifier: '',
  expirationDate: new Date(),
};
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

describe('Protocol Gas Workspace Controller', () => {
  let controller: ProtocolGasWorkspaceController;
  let service: ProtocolGasWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ProtocolGasWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        TestSummaryWorkspaceModule,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: ProtocolGasWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: ProtocolGasChecksService,
          useFactory: mockCheckService,
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
        await controller.createProtocolGas(locId, testSumId, payload, user),
      ).toEqual(protocolGasRecord);
    });
  });
});
