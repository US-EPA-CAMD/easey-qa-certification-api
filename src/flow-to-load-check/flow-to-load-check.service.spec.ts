import { Test, TestingModule } from '@nestjs/testing';

import { FlowToLoadCheckDTO } from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckRepository } from './flow-to-load-check.repository';
import { FlowToLoadCheckService } from './flow-to-load-check.service';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const testSumId = 'j5ft68';
const flowToLoadCheckId = '';
const entity = new FlowToLoadCheck();
const flowToLoadCheck = new FlowToLoadCheckDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
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
  let dataSource: DataSource;

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
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<FlowToLoadCheckService>(FlowToLoadCheckService);

    repository = module.get<FlowToLoadCheckRepository>(
      FlowToLoadCheckRepository,
    );
  });

  describe('getFlowToLoadCheck', () => {
    it('Calls repository.findOneBy({id}) to get a single Flow To Load Check record', async () => {
      const repo = mockRepository();  
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        );
      const result = await service.getFlowToLoadCheck(flowToLoadCheckId);
      expect(result).toEqual(flowToLoadCheck);
      expect(repo.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when a Flow To Load Check record not found', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(jest.spyOn(repository, 'findOneBy').mockResolvedValue(null))
        );
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
      const repo = mockRepository();  
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        );
      const results = await service.getFlowToLoadChecks(flowToLoadCheckId);
      expect(results).toEqual([flowToLoadCheck]);
      expect(repo.find).toHaveBeenCalled();
    });
  });
  describe('Export', () => {
    it('Should Export Flow To Load Check', async () => {
      jest
        .spyOn(service, 'getFlowToLoadChecksByTestSumIds')
        .mockResolvedValue([flowToLoadCheck]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([flowToLoadCheck]);
    });
  });
});
