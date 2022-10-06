import { Test, TestingModule } from '@nestjs/testing';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';

import { FlowToLoadCheckDTO } from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheckRepository } from './flow-to-load-check.repository';
import { FlowToLoadCheckService } from './flow-to-load-check.service';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';

const flowToLoadCheckId = '';
const entity = new FlowToLoadCheck();
const flowToLoadCheck = new FlowToLoadCheckDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowToLoadCheck),
  many: jest.fn().mockResolvedValue([flowToLoadCheck]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('FlowToLoadCheckService', () => {
  let service: FlowToLoadCheckService;
  let repository: FlowToLoadCheckRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowToLoadCheckService,
        {
          provide: FlowToLoadCheckRepository,
          useFactory: mockRepository,
        },
        {
          provide: FlowToLoadCheckMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FlowToLoadCheckService>(FlowToLoadCheckService);

    repository = module.get<FlowToLoadCheckRepository>(
      FlowToLoadCheckRepository,
    );
  });

  describe('getFlowToLoadCheck', () => {
    it('Calls repository.findOne({id}) to get a single Flow To Load Check record', async () => {
      const result = await service.getFlowToLoadCheck(flowToLoadCheckId);
      expect(result).toEqual(flowToLoadCheck);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when a Flow To Load Check record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getFlowToLoadCheck(flowToLoadCheckId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getFlowToLoadChecks', () => {
    it('Calls Repository to find all Flow To Load Check records for a given Test Summary ID', async () => {
      const results = await service.getFlowToLoadChecks(flowToLoadCheckId);
      expect(results).toEqual([flowToLoadCheck]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
