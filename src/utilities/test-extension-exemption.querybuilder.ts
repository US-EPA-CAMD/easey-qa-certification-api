import { Brackets, SelectQueryBuilder } from 'typeorm';
import { TestExtensionExemption } from '../entities/test-extension-exemption.entity';
import { TestExtensionExemption as WorkspaceTestExtensionExemption } from '../entities/workspace/test-extension-exemption.entity';

export const addJoins = (
  query: SelectQueryBuilder<
    TestExtensionExemption | WorkspaceTestExtensionExemption
  >,
): SelectQueryBuilder<
  TestExtensionExemption | WorkspaceTestExtensionExemption
> => {
  return query
    .innerJoinAndSelect('tee.location', 'ml')
    .leftJoinAndSelect('tee.reportingPeriod', 'rp')
    .leftJoinAndSelect('tee.system', 'ms')
    .leftJoinAndSelect('tee.component', 'c')
    .leftJoinAndSelect('ml.unit', 'u')
    .leftJoin('u.plant', 'up')
    .leftJoinAndSelect('ml.stackPipe', 'sp')
    .leftJoin('sp.plant', 'spp');
};

export const addTestExtExemIdWhere = (
  query: any,
  qaTestExtensionExemptionIds: string[],
): SelectQueryBuilder<
  TestExtensionExemption | WorkspaceTestExtensionExemption
> => {
  if (qaTestExtensionExemptionIds) {
    query.andWhere('tee.id IN (:...qaTestExtensionExemptionIds)', {
      qaTestExtensionExemptionIds,
    });
  }
  return query;
};

export const addBeginAndEndDateWhere = (
  query: SelectQueryBuilder<
    TestExtensionExemption | WorkspaceTestExtensionExemption
  >,
  beginDate: Date,
  endDate: Date,
): SelectQueryBuilder<
  TestExtensionExemption | WorkspaceTestExtensionExemption
> => {
  if (beginDate && endDate) {
    query.andWhere(
      new Brackets(qb1 => {
        qb1.where(
          new Brackets(qb2 => {
            qb2
              .where('rp.beginDate = :beginDate', { beginDate })
              .andWhere('rp.endDate = :endDate', { endDate });
          }),
        );
      }),
    );
  }

  return query;
};
