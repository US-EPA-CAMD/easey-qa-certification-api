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

describe('QACertificationEventWorkspaceRepository', () => {
  let repository: QACertificationEventRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QACertificationEventRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
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
