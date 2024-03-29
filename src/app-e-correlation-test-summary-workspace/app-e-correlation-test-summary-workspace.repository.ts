import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { EntityRepository, Not, Repository } from 'typeorm';

@EntityRepository(AppECorrelationTestSummary)
export class AppendixETestSummaryWorkspaceRepository extends Repository<
  AppECorrelationTestSummary
> {
  /**
        Returns (one) duplicate AppendixETestSummary if found,
        where a duplicate is defined as having the same TestSumId and
        OperatingLevelNumber, but not the same AppETestSumId (if provided)
     **/
  async findDuplicate(
    appETestSumId: string,
    testSumId: string,
    opLevel: number,
  ): Promise<AppECorrelationTestSummary> {
    let options = {
      where: {
        id: Not(appETestSumId),
        testSumId: testSumId,
        operatingLevelForRun: opLevel,
      },
    };

    if (!appETestSumId) delete options.where.id;

    return await this.findOne(options);
  }
}
