import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { FlowToLoadCheckBaseDTO } from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheckWorkspaceController } from './flow-to-load-check-workspace.controller';
import { FlowToLoadCheckWorkspaceService } from './flow-to-load-check-workspace.service';

const locId = '';
const testSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
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

const payload = new FlowToLoadCheckBaseDTO();

describe('FlowToLoadCheckWorkspaceController', () => {
  let controller: FlowToLoadCheckWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FlowToLoadCheckWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FlowToLoadCheckWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FlowToLoadCheckWorkspaceController>(
      FlowToLoadCheckWorkspaceController,
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

  describe('createFlowToLoadCheck', () => {
    it('Calls the service to create a new Flow To Load Check record', async () => {
      const result = await controller.createFlowToLoadCheck(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(flowToLoadCheck);
    });
  });

  describe('editFlowToLoadCheck', () => {
    it('Calls the service and edits a Flow To Load Check record', async () => {
      expect(
        await controller.editFlowToLoadCheck(
          locId,
          testSumId,
          flowToLoadCheckId,
          payload,
          user,
        ),
      ).toEqual(flowToLoadCheck);
    });
  });

  describe('deleteFlowToLoadCheck', () => {
    it('Calls the service and delete a Flow To Load Check record', async () => {
      const result = await controller.deleteFlowToLoadCheck(
        locId,
        testSumId,
        flowToLoadCheckId,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
