import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { FlowToLoadReferenceBaseDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceWorkspaceController } from './flow-to-load-reference-workspace.controller';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';

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
const flowToLoadCheck = new FlowToLoadReferenceBaseDTO();

const mockService = () => ({
  createFlowToLoadReference: jest.fn().mockResolvedValue(flowToLoadCheck),
});

const payload = new FlowToLoadReferenceBaseDTO();

describe('FlowToLoadReferenceWorkspaceController', () => {
  let controller: FlowToLoadReferenceWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FlowToLoadReferenceWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FlowToLoadReferenceWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FlowToLoadReferenceWorkspaceController>(
      FlowToLoadReferenceWorkspaceController,
    );
  });

  describe('createFlowToLoadCheck', () => {
    it('Calls the service to create a new Flow To Load Check record', async () => {
      const result = await controller.createFlowToLoadReference(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(flowToLoadCheck);
    });
  });
});
