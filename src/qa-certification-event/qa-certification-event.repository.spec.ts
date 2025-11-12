import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { QACertificationEvent } from '../entities/qa-certification-event.entity';
import * as qaCertQueryBuilder from '../utilities/qa-cert-events.querybuilder';
import { QACertificationEventRepository } from './qa-certification-event.repository';

const qaCertEvent = new QACertificationEvent();

const mockQueryBuilder : jest.Mocked<SelectQueryBuilder<QACertificationEvent>> = {
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
} as any;

describe('QACertificationEventWorkspaceRepository', () => {
  let repository: QACertificationEventRepository;
  let queryBuilder = mockQueryBuilder;
  let mockEntityManager;
  let mockSlaveManager;
  let mockQueryRunner;

  beforeEach(async () => {
    mockSlaveManager = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockQueryRunner = {
      manager: mockSlaveManager,
    };

    mockEntityManager = {
      connection: {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        { provide: EntityManager, useValue: mockEntityManager },
        QACertificationEventRepository,
      ],
    }).compile();

    repository = module.get<QACertificationEventRepository>(
      QACertificationEventRepository,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    jest.spyOn(qaCertQueryBuilder, 'addJoins').mockReturnValue(queryBuilder);
  });

  describe('getQACertificationEventById', () => {
    it('calls buildBaseQuery and get one QA Certification Event from the repository with Id', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(Promise.resolve(qaCertEvent));

      const result = await repository.getQACertificationEventById('1');

      expect(result).toEqual(qaCertEvent);
    });
  });

  describe('getQACertificationEventsByLocationId', () => {
    it('get many QA Certification Event from the repository with locationId, testTypeCode, beginDate and endDate', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue(Promise.resolve([qaCertEvent]));

      const result = await repository.getQACertificationEventsByLocationId('1');

      expect(result).toEqual([qaCertEvent]);
    });
  });

  describe('getQaCertEventsByUnitStack', () => {
    it('get QA Certification Event from the repository with facilityId', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue(Promise.resolve([qaCertEvent]));

      const result = await repository.getQaCertEventsByUnitStack(1);

      expect(result).toEqual([qaCertEvent]);
    });

    it('get QA Certification Event from the repository with facilityId, unitids, stackPipeIds', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue(Promise.resolve([qaCertEvent]));

      const result = await repository.getQaCertEventsByUnitStack(
        1,
        ['1'],
        ['1'],
      );
      expect(result).toEqual([qaCertEvent]);
    });
  });
});
