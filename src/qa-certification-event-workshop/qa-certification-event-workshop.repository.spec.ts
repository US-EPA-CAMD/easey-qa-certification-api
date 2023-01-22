import { Test } from '@nestjs/testing';
import { QACertificationEvent } from '../entities/qa-certification-event.entity';
import { SelectQueryBuilder } from 'typeorm';

import * as qaCertQueryBuilder from '../utilities/qa-cert-events.querybuilder';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workshop.repository';

const qaCertEvent = new QACertificationEvent();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
});

describe('QACertificationEventWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QACertificationEventWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(QACertificationEventWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<QACertificationEvent>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    jest.spyOn(qaCertQueryBuilder, 'addJoins').mockReturnValue(queryBuilder);
  });

  describe('getQACertificationEventById', () => {
    it('calls buildBaseQuery and get one Test Extension Exemption from the repository with Id', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(qaCertEvent);

      const result = await repository.getQACertificationEventById('1');

      expect(result).toEqual(qaCertEvent);
    });
  });

  describe('getQACertificationEventsByLocationId', () => {
    it('get many test Extension Exemption from the repository with locationId, testTypeCode, beginDate and endDate', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([qaCertEvent]);

      const result = await repository.getQACertificationEventsByLocationId('1');

      expect(result).toEqual([qaCertEvent]);
    });
  });

  describe('getQaCertEventsByUnitStack', () => {
    it('get one test summary from the repository with facilityId', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([qaCertEvent]);

      const result = await repository.getQaCertEventsByUnitStack('1');

      expect(result).toEqual([qaCertEvent]);
    });

    it('get one test summary from the repository with facilityId, unitids, stackPipeIds', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([qaCertEvent]);

      const result = await repository.getQaCertEventsByUnitStack(
        '1',
        ['1'],
        ['1'],
      );

      expect(result).toEqual([qaCertEvent]);
    });
  });
});
