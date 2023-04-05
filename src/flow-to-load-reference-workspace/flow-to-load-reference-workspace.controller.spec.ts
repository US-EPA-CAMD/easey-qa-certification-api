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
  facilities: [],
  roles: [],
};
const flowToLoadReferenceId = '';
const flowToLoadReference = new FlowToLoadReferenceBaseDTO();
const flowToLoadReferences = [flowToLoadReference];

const mockService = () => ({
  getFlowToLoadReferences: jest.fn().mockResolvedValue(flowToLoadReferences),
  getFlowToLoadReference: jest.fn().mockResolvedValue(flowToLoadReference),
  createFlowToLoadReference: jest.fn().mockResolvedValue(flowToLoadReference),
  editFlowToLoadReference: jest.fn().mockResolvedValue(flowToLoadReference),
  deleteFlowToLoadReference: jest.fn().mockResolvedValue(undefined),
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

  describe('getFlowToLoadReferences', () => {
    it('Calls the repository to get all Flow To Load Reference records by Test Summary Id', async () => {
      const result = await controller.getFlowToLoadReferences(locId, testSumId);
      expect(result).toEqual(flowToLoadReferences);
    });
  });

  describe('getFlowToLoadReference', () => {
    it('Calls the repository to get one Flow To Load Reference record by Id', async () => {
      const result = await controller.getFlowToLoadReference(
        locId,
        testSumId,
        flowToLoadReferenceId,
      );
      expect(result).toEqual(flowToLoadReference);
    });
  });

  describe('createFlowToLoadReference', () => {
    it('Calls the service to create a new Flow To Load Reference record', async () => {
      const result = await controller.createFlowToLoadReference(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(flowToLoadReference);
    });
  });

  describe('editFlowToLoadReference', () => {
    it('should call the Flow To Load Reference record', async () => {
      expect(
        await controller.editFlowToLoadReference(
          locId,
          testSumId,
          flowToLoadReferenceId,
          payload,
          user,
        ),
      ).toEqual(flowToLoadReference);
    });
  });

  describe('deleteFlowToLoadReference', () => {
    it('Calls the service and delete a Flow To Load Reference record', async () => {
      const result = await controller.deleteFlowToLoadReference(
        locId,
        testSumId,
        flowToLoadReferenceId,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
