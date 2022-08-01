import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { ProtocolGasWorkspaceController } from './protocol-gas.controller';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

jest.mock('./protocol-gas.service');

const locId = '';
const testSumId = '';
const protocolGases: ProtocolGasDTO[] = [];
protocolGases.push(new ProtocolGasDTO());

describe('Protocol Gas Workspace Controller', () => {
  let controller: ProtocolGasWorkspaceController;
  let service: ProtocolGasWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtocolGasWorkspaceController],
      providers: [TestSummaryWorkspaceModule, ProtocolGasWorkspaceService],
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
      expect(controller.getProtocolGases(locId, testSumId)).toBe(protocolGases);
    });
  });
});
