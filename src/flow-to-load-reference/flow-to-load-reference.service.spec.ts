import { Test, TestingModule } from '@nestjs/testing';

import { FlowToLoadReferenceDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { FlowToLoadReferenceRepository } from './flow-to-load-reference.repository';
import { FlowToLoadReferenceService } from './flow-to-load-reference.service';

const flowToLoadReferenceId = '';
const entity = new FlowToLoadReference();
const flowToLoadReference = new FlowToLoadReferenceDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowToLoadReference),
  many: jest.fn().mockResolvedValue([flowToLoadReference]),
});

describe('FlowToLoadCheckService', () => {
  let service: FlowToLoadReferenceService;
  let repository: FlowToLoadReferenceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowToLoadReferenceService,
        {
          provide: FlowToLoadReferenceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FlowToLoadReferenceMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FlowToLoadReferenceService>(
      FlowToLoadReferenceService,
    );

    repository = module.get<FlowToLoadReferenceRepository>(
      FlowToLoadReferenceRepository,
    );
  });

  describe('getFlowToLoadReference', () => {
    it('Calls repository.findOneBy({id}) to get a single Flow To Load Reference record', async () => {
      const result = await service.getFlowToLoadReference(
        flowToLoadReferenceId,
      );
      expect(result).toEqual(flowToLoadReference);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when a Flow To Load Reference record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getFlowToLoadReference(flowToLoadReferenceId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getFlowToLoadChecks', () => {
    it('Calls Repository to find all Flow To Load Check records for a given Test Summary ID', async () => {
      const results = await service.getFlowToLoadReferences(
        flowToLoadReferenceId,
      );
      expect(results).toEqual([flowToLoadReference]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
