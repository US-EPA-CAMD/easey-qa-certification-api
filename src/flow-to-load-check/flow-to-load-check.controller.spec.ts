import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { FlowToLoadCheckBaseDTO } from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheckController } from './flow-to-load-check.controller';
import { FlowToLoadCheckService } from './flow-to-load-check.service';

const locId = '';
const testSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const flowToLoadCheckId = '';
const flowToLoadCheck = new FlowToLoadCheckBaseDTO();
const flowToLoadChecks = [flowToLoadCheck];

const mockService = () => ({
  getFlowToLoadChecks: jest.fn().mockResolvedValue(flowToLoadChecks),
  getFlowToLoadCheck: jest.fn().mockResolvedValue(flowToLoadCheck),
  createFlowToLoadCheck: jest.fn().mockResolvedValue(flowToLoadCheck),
});

describe('FlowToLoadCheckController', () => {
  let controller: FlowToLoadCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FlowToLoadCheckController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FlowToLoadCheckService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FlowToLoadCheckController>(
      FlowToLoadCheckController,
    );
  });

  describe('getflowToLoadChecks', () => {
    it('Calls the repository to get all Flow To Load Check records by Test Summary Id', async () => {
      const result = await controller.getFlowToLoadChecks(locId, testSumId);
      expect(result).toEqual(flowToLoadChecks);
    });
  });

  describe('getFlowToLoadCheck', () => {
    it('Calls the repository to get one Flow To Load Check record by Id', async () => {
      const result = await controller.getFlowToLoadCheck(
        locId,
        testSumId,
        flowToLoadCheckId,
      );
      expect(result).toEqual(flowToLoadCheck);
    });
  });
});
