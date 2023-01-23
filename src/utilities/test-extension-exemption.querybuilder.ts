import { SelectQueryBuilder } from 'typeorm';
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
    .leftJoinAndSelect('tee.system', 'ms')
    .leftJoinAndSelect('tee.component', 'c')
    .leftJoinAndSelect('tee.reportingPeriod', 'rp')
    .leftJoinAndSelect('ml.unit', 'u')
    .leftJoin('u.plant', 'up')
    .leftJoinAndSelect('ml.stackPipe', 'sp')
    .leftJoin('sp.plant', 'spp');
};

export const addTestSummaryIdWhere = (
  query: any,
  qaCertificationEventIds: string[],
): SelectQueryBuilder<
  TestExtensionExemption | WorkspaceTestExtensionExemption
> => {
  if (qaCertificationEventIds) {
    query.andWhere('qce.id IN (:...qaCertificationEventIds)', {
      qaCertificationEventIds,
    });
  }
  return query;
};
