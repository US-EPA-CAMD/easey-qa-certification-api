import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

import { FlowToLoadReferenceBaseDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceController } from './flow-to-load-reference.controller';
import { FlowToLoadReferenceService } from './flow-to-load-reference.service';

const locId = '';
const testSumId = '';
const flowToLoadReferenceId = '';
const flowToLoadReference = new FlowToLoadReferenceBaseDTO();
const flowToLoadReferences = [flowToLoadReference];

const mockService = () => ({
  getFlowToLoadReferences: jest.fn().mockResolvedValue(flowToLoadReferences),
  getFlowToLoadReference: jest.fn().mockResolvedValue(flowToLoadReference),
});

describe('FlowToLoadCheckController', () => {
  let controller: FlowToLoadReferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FlowToLoadReferenceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FlowToLoadReferenceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FlowToLoadReferenceController>(
      FlowToLoadReferenceController,
    );
  });

  describe('flowToLoadReferences', () => {
    it('Calls the repository to get all Flow To Load Reference records by Test Summary Id', async () => {
      const result = await controller.getFlowToLoadReferences(locId, testSumId);
      expect(result).toEqual(flowToLoadReferences);
    });
  });

  describe('flowToLoadReference', () => {
    it('Calls the repository to get one Flow To Load Reference record by Id', async () => {
      const result = await controller.getFlowToLoadReference(
        locId,
        testSumId,
        flowToLoadReferenceId,
      );
      expect(result).toEqual(flowToLoadReference);
    });
  });
});
