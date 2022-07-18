import { Brackets, SelectQueryBuilder } from 'typeorm';

import { TestSummary } from '../entities/test-summary.entity';
import { TestSummary as WorkspaceTestSummary } from '../entities/workspace/test-summary.entity';

export const addComponentIdWhere = (
  query: SelectQueryBuilder<TestSummary | WorkspaceTestSummary>,
  componentId: string,
): SelectQueryBuilder<TestSummary | WorkspaceTestSummary> => {
  query.andWhere('ar.componentRecordId = :componentIDd', { componentId });

  return query;
};
