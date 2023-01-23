import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import * as qaCertQueryBuilder from '../utilities/qa-cert-events.querybuilder';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workshop.repository';
import { QACertificationEvent } from '../entities/workspace/qa-certification-event.entity';

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
  let repository: QACertificationEventWorkspaceRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QACertificationEventWorkspaceRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get<QACertificationEventWorkspaceRepository>(
      QACertificationEventWorkspaceRepository,
    );
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

    jest.spyOn(repository, 'addJoins').mockReturnValue(queryBuilder);
  });

  describe('getQACertificationEventById', () => {
    it('gets a QA Certification Event record from the workspace repository with Id', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(qaCertEvent);

      const result = await repository.getQACertEventById('1');

      expect(result).toEqual(qaCertEvent);
    });
  });

  describe('getTestExtensionExemptionsByLocationId', () => {
    it('gets many QA Certification Event from the workspace repository with locationId', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([qaCertEvent]);

      const result = await repository.getQACertEventsByLocationId('1');

      expect(result).toEqual([qaCertEvent]);
    });
  });
});
