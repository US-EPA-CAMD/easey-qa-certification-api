import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder, DataSource } from 'typeorm';

import { QACertificationEvent } from '../entities/qa-certification-event.entity';
import * as qaCertQueryBuilder from '../utilities/qa-cert-events.querybuilder';
import { QACertificationEventRepository } from './qa-certification-event.repository';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');
const qaCertEvent = new QACertificationEvent();

const mockQueryBuilder = {
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
};

const mockManager = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('QACertificationEventWorkspaceRepository', () => {
  let repository: QACertificationEventRepository;
  let queryBuilder;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        QACertificationEventRepository,
        { provide: SelectQueryBuilder, useFactory: () =>  mockQueryBuilder },
        {provide: DataSource, useValue: dataSource },      
      ],
    }).compile();

    repository = module.get<QACertificationEventRepository>(
      QACertificationEventRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<QACertificationEvent>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    jest.spyOn(qaCertQueryBuilder, 'addJoins').mockReturnValue(queryBuilder);
    
    (withSlaveConnection as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager))
  });

  describe('getQACertificationEventById', () => {
    it('calls buildBaseQuery and get one QA Certification Event from the repository with Id', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(qaCertEvent);

      const result = await repository.getQACertificationEventById('1');

      expect(result).toEqual(qaCertEvent);
    });
  });

  describe('getQACertificationEventsByLocationId', () => {
    it('get many QA Certification Event from the repository with locationId, testTypeCode, beginDate and endDate', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([qaCertEvent]);

      const result = await repository.getQACertificationEventsByLocationId('1');

      expect(result).toEqual([qaCertEvent]);
    });
  });

  describe('getQaCertEventsByUnitStack', () => {
    it('get QA Certification Event from the repository with facilityId', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([qaCertEvent]);

      const result = await repository.getQaCertEventsByUnitStack(1);

      expect(result).toEqual([qaCertEvent]);
    });

    it('get QA Certification Event from the repository with facilityId, unitids, stackPipeIds', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([qaCertEvent]);

      const result = await repository.getQaCertEventsByUnitStack(
        1,
        ['1'],
        ['1'],
      );
      expect(result).toEqual([qaCertEvent]);
    });
  });
});