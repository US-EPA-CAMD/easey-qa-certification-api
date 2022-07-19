import { EntityRepository, Repository } from 'typeorm';
import { TestSummaryBaseDTO } from '../dto/test-summary.dto';
import { AnalyzerRange } from '../entities/workspace/analyzerRange.entity';

@EntityRepository(AnalyzerRange)
export class AnalyzerRangeWorkspaceRepository extends Repository<
  AnalyzerRange
> {
  async getAnalyzerRangeByComponentIdAndDate(
    componentRecordId: string,
    summary: TestSummaryBaseDTO,
  ): Promise<AnalyzerRange[]> {
    const beginDate = summary.beginDate;
    const beginHour = summary.beginHour;
    const endDate = summary.endDate;
    const endHour = summary.endHour;

    return this.createQueryBuilder('ar')
      .where('ar.componentRecordId = :componentRecordId', {
        componentRecordId,
      })
      .andWhere('(ar.beginDate <= :beginDate AND ar.beginHour <= :beginHour)', {
        beginDate,
        beginHour,
      })
      .andWhere(
        'ar.endDate IS NULL OR ar.endDate >= :endDate AND ar.endHour >= :endHour',
        {
          endDate,
          endHour,
        },
      )
      .getMany();
  }
}
