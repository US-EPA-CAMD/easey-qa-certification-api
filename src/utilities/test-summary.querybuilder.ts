import { Brackets, SelectQueryBuilder } from 'typeorm';

import { TestSummary } from '../entities/test-summary.entity';
import { TestSummary as WorkspaceTestSummary } from '../entities/workspace/test-summary.entity';

export const addJoins = (
  query: SelectQueryBuilder<TestSummary | WorkspaceTestSummary>,
): SelectQueryBuilder<TestSummary | WorkspaceTestSummary> => {
  return query
    .innerJoinAndSelect('ts.location', 'ml')
    .leftJoinAndSelect('ts.system', 'ms')
    .leftJoinAndSelect('ts.component', 'c')
    .leftJoinAndSelect('ts.reportingPeriod', 'rp')
    .leftJoinAndSelect('ml.unit', 'u')
    .leftJoin('u.plant', 'up')
    .leftJoinAndSelect('ml.stackPipe', 'sp')
    .leftJoin('sp.plant', 'spp');
};

export const addTestTypeWhere = (
  query: SelectQueryBuilder<TestSummary | WorkspaceTestSummary>,
  testTypeCodes: string[],
): SelectQueryBuilder<TestSummary | WorkspaceTestSummary> => {
  if (testTypeCodes) {
    query.andWhere('ts.testTypeCode IN (:...testTypeCodes)', { testTypeCodes });
  }

  return query;
};

export const addSystemTypeWhere = (
  query: SelectQueryBuilder<TestSummary | WorkspaceTestSummary>,
  systemTypeCodes: string[],
): SelectQueryBuilder<TestSummary | WorkspaceTestSummary> => {
  if (systemTypeCodes) {
    query.andWhere('ms.systemTypeCode IN (:...systemTypeCodes)', {
      systemTypeCodes,
    });
  }

  return query;
};

export const addTestSummaryIdWhere = (
  query: any,
  testSummaryIds: string[],
): SelectQueryBuilder<TestSummary | WorkspaceTestSummary> => {
  if (testSummaryIds) {
    query.andWhere('ts.id IN (:...testSummaryIds)', { testSummaryIds });
  }
  return query;
};

export const addTestNumberWhere = (
  query: SelectQueryBuilder<TestSummary | WorkspaceTestSummary>,
  testNumber: string,
): SelectQueryBuilder<TestSummary | WorkspaceTestSummary> => {
  if (testNumber) {
    query.andWhere('ts.testNumber = :testNumber', { testNumber });
  }

  return query;
};

export const addBeginAndEndDateWhere = (
  query: SelectQueryBuilder<TestSummary | WorkspaceTestSummary>,
  beginDate: Date,
  endDate: Date,
): SelectQueryBuilder<TestSummary | WorkspaceTestSummary> => {
  if (beginDate && endDate) {
    query.andWhere(
      new Brackets(qb1 => {
        qb1
          .where(
            new Brackets(qb2 => {
              qb2
                .where('ts.reportingPeriod IS NULL')
                .andWhere('ts.beginDate IS NOT NULL')
                .andWhere('ts.beginDate BETWEEN :beginDate AND :endDate', {
                  beginDate,
                  endDate,
                })
                .andWhere('ts.endDate IS NOT NULL')
                .andWhere('ts.endDate BETWEEN :beginDate AND :endDate', {
                  beginDate,
                  endDate,
                });
            }),
          )
          .orWhere(
            new Brackets(qb3 => {
              qb3
                .where('ts.reportingPeriod IS NOT NULL')
                .andWhere('rp.beginDate = :beginDate', { beginDate })
                .andWhere('rp.endDate = :endDate', { endDate });
            }),
          );
      }),
    );
  }

  return query;
};
