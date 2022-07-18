import { EntityRepository, Repository } from 'typeorm';
import { TestSummaryBaseDTO } from '../dto/test-summary.dto';
import { AnalyzerRange } from '../entities/workspace/analyzerRange.entity';

@EntityRepository(AnalyzerRange)
export class AnalyzerRangeWorkspaceRepository extends Repository<
  AnalyzerRange
> {
  async getAnalyzerRangeByComponentIdAndDate(
    summary: TestSummaryBaseDTO,
  ): Promise<AnalyzerRange> {
    const componentId = summary.componentID;
    const spanScaleCode = summary.spanScaleCode;
    let analyzerRanceCode: string;
    const beginDate = summary.beginDate;
    const beginHour = summary.beginHour;
    const endDate = summary.endDate;
    const endHour = summary.endHour;

    if (spanScaleCode === 'H') analyzerRanceCode = 'L';
    if (spanScaleCode === 'L') analyzerRanceCode = 'H';

    return this.createQueryBuilder('ar')
      .where('ar.componentRecordId = :componentId', {
        componentId,
      })
      .andWhere('ar.analyzerRanceCode = :analyzerRanceCode', {
        analyzerRanceCode,
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
      .getOne();
  }
}
