import { EntityRepository, Not, Repository } from 'typeorm';
import { AppECorrelationTestRun } from '../entities/workspace/app-e-correlation-test-run.entity';

@EntityRepository(AppECorrelationTestRun)
export class AppECorrelationTestRunWorkspaceRepository extends Repository<
  AppECorrelationTestRun
> {
  /**
     Returns (one) duplicate AppendixETestRun if found,
     where a duplicate is defined as having the same AppETestSumId,
     AppendixETestSummary.OperatingLevelNumber, and RunNumber,
     but not the same AppETestSumId (if provided)
     **/
  async findDuplicate(
    appETestRunId: string,
    appETestSumId: string,
    opLevel: number,
    runNumber: number,
  ): Promise<AppECorrelationTestRun> {
    let options = {
      relations: ['appECorrelationTestSummary'],
      where: {
        appECorrelationTestSummary: {
          id: appETestSumId,
          operatingLevelForRun: opLevel,
        },
        runNumber: runNumber,
        id: Not(appETestRunId),
      },
    };

    if (!appETestRunId) delete options.where.id;

    return this.findOne(options);
  }
}
