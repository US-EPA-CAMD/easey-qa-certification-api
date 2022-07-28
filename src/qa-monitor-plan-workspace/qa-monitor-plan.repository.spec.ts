import { Test } from '@nestjs/testing';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { SelectQueryBuilder } from 'typeorm';
import { QAMonitorPlanWorkspaceRepository } from './qa-monitor-plan.repository';

const mockQueryBuilder = () => ({
  innerJoin: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn().mockReturnValue(new MonitorPlan()),
});

describe('TestSummaryRelationshipsRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QAMonitorPlanWorkspaceRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get<QAMonitorPlanWorkspaceRepository>(
      QAMonitorPlanWorkspaceRepository,
    );

    queryBuilder = module.get<SelectQueryBuilder<MonitorPlan>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.innerJoin = jest.fn().mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect = jest.fn().mockReturnValue(queryBuilder);
    queryBuilder.where = jest.fn().mockReturnValue(queryBuilder);
    queryBuilder.andWhere = jest.fn().mockReturnValue(queryBuilder);
  });

  it('should find a monitor Plan with unitId', async () => {
    expect(
      await repository.getMonitorPlanWithALowerBeginDate(
        '1',
        '1',
        null,
        new Date(),
      ),
    ).toEqual(new MonitorPlan());
  });

  it('should find a monitor Plan with stackPipeId', async () => {
    expect(
      await repository.getMonitorPlanWithALowerBeginDate(
        '1',
        null,
        '1',
        new Date(),
      ),
    ).toEqual(new MonitorPlan());
  });
});
