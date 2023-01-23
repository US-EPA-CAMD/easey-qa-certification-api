import { Test } from '@nestjs/testing';
import { QACertificationEvent } from '../entities/qa-certification-event.entity';
import { SelectQueryBuilder } from 'typeorm';

import * as qaCertQueryBuilder from '../utilities/qa-cert-events.querybuilder';
import { QACertificationEventRepository } from './qa-certification-event.repository';

const qaCertEvent = new QACertificationEvent();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
});

describe('QACertificationEventRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QACertificationEventRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(QACertificationEventRepository);
    queryBuilder = module.get<SelectQueryBuilder<QACertificationEvent>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    jest.spyOn(qaCertQueryBuilder, 'addJoins').mockReturnValue(queryBuilder);
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